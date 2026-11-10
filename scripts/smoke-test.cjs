const fs = require("node:fs/promises");
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
const queue = ["/"];
const seen = new Set();
const results = [];
(async () => {
  while (queue.length) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    const r = await fetch(new URL(path, origin));
    const html = await r.text();
    if (!r.ok) throw new Error(`${path}: ${r.status}`);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    if (!title) throw new Error(`Missing title: ${path}`);
    const headings = [...html.matchAll(/<h1[\s>]/g)];
    if (headings.length !== 1)
      throw new Error(`Expected one H1 on ${path}, got ${headings.length}`);
    if (!html.includes('rel="canonical"'))
      throw new Error(`Missing canonical: ${path}`);
    results.push({ path, status: r.status, title });
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const p = m[1].replace(/\/$/, "") || "/";
      if (p.startsWith("/_next") || p.includes(".") || p.startsWith("/api/"))
        continue;
      if (!seen.has(p)) queue.push(p);
    }
  }
  for (const path of ["/sitemap.xml", "/robots.txt", "/opengraph-image"]) {
    const r = await fetch(origin + path);
    if (!r.ok) throw new Error(`${path}: ${r.status}`);
    results.push({ path, status: r.status });
  }
  const missing = await fetch(origin + "/this-page-does-not-exist");
  if (missing.status !== 404)
    throw new Error("Missing page did not return 404");
  await fs.writeFile(
    "docs/smoke-results.json",
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        origin,
        results,
        notFoundStatus: missing.status,
      },
      null,
      2,
    ),
  );
  console.log(
    `Passed: ${seen.size} linked pages, 3 metadata resources, correct 404.`,
  );
})().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});

const fs = require("node:fs/promises");
(async () => {
  const root = "https://a1drivingacademy.co.uk/";
  const seen = new Set();
  const queue = [root];
  const pages = [];
  const socials = new Set();
  while (queue.length && seen.size < 40) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      const r = await fetch(url);
      const html = await r.text();
      const links = [...html.matchAll(/href=["']([^"']+)["']/g)].map(
        (x) => x[1],
      );
      for (const href of links) {
        try {
          const u = new URL(href, url);
          if (
            /facebook|instagram|youtube|youtu.be|twitter|tiktok|linkedin|wa.me/i.test(
              u.hostname,
            )
          )
            socials.add(u.href);
          if (
            u.origin === new URL(root).origin &&
            !/wp-|\.(png|jpg|pdf)|\?|#/.test(u.href) &&
            !seen.has(u.href)
          )
            queue.push(u.href);
        } catch {}
      }
      pages.push({
        url,
        status: r.status,
        title: html.match(/<title>(.*?)<\/title>/s)?.[1],
        links: [...new Set(links)],
        text: html
          .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
      });
    } catch (e) {
      pages.push({ url, error: e.message });
    }
  }
  await fs.writeFile(
    "docs/source-audit.json",
    JSON.stringify(
      { capturedAt: new Date().toISOString(), socials: [...socials], pages },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ pages: pages.length, socials: [...socials] }));
})();

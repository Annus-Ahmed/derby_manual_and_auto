const fs = require("node:fs/promises");
const photos = [
  "photo-1449965408869-eaa3f722e40d",
  "photo-1503376780353-7e6692767b70",
  "photo-1464822759023-fed622ff2c3b",
  "photo-1500534623283-312aade485b7",
];
(async () => {
  for (const id of photos) {
    const r = await fetch(
      `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2200&q=85`,
    );
    if (!r.ok) throw new Error(`${id}: ${r.status}`);
    const data = Buffer.from(await r.arrayBuffer());
    await fs.writeFile(`public/images/${id}.jpg`, data);
    console.log(id, data.length);
  }
})();

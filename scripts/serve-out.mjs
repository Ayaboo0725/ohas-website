/**
 * Tiny zero-dependency static server to preview the production build locally.
 * Usage: npm run build && npm run preview   (then open http://localhost:4173)
 * For real hosting, upload the /out folder to any static host.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../out");
const port = Number(process.env.PORT ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
    let file = normalize(join(root, url));
    if (!file.startsWith(root)) throw new Error("outside root");
    const s = await stat(file).catch(() => null);
    if (s?.isDirectory()) file = join(file, "index.html");
    else if (!s) file = (await stat(`${file}.html`).catch(() => null)) ? `${file}.html` : join(root, "404.html");
    const body = await readFile(file);
    res.writeHead(file.endsWith("404.html") && url !== "/404" ? 404 : 200, {
      "Content-Type": types[extname(file)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(500).end("Server error");
  }
}).listen(port, () => console.log(`Previewing /out at http://localhost:${port}`));

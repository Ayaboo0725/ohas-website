/**
 * Renders the static image assets from the live 3D scene:
 *   public/hero/croissant-still.webp  – fallback for no-WebGL / reduced motion / low-power phones
 *   public/og.png                     – 1200×630 social share card
 *
 * Usage: start the dev server (npm run dev -- -p 3210), then
 *        node scripts/render-assets.mjs [baseUrl]
 * Needs a local Chrome or Edge (headless, software WebGL).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import sharp from "sharp";

const base = process.argv[2] ?? "http://localhost:3210";
const root = resolve(import.meta.dirname, "..");

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) throw new Error("No Chrome/Edge found. Set CHROME_PATH.");

const tmp = join(tmpdir(), `ohas-render-${Date.now()}`);
mkdirSync(tmp, { recursive: true });

function shoot(path, out, width, height, transparent) {
  const args = [
    "--headless=new",
    "--hide-scrollbars",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--force-device-scale-factor=1",
    `--window-size=${width},${height}`,
    "--virtual-time-budget=9000",
    `--user-data-dir=${join(tmp, "profile")}`,
    `--screenshot=${out}`,
  ];
  if (transparent) args.push("--default-background-color=00000000");
  args.push(`${base}${path}`);
  execFileSync(chrome, args, { stdio: "inherit", timeout: 120_000 });
}

mkdirSync(join(root, "public/hero"), { recursive: true });

const stillPng = join(tmp, "still.png");
shoot("/render", stillPng, 1600, 1000, true);
await sharp(stillPng).webp({ quality: 86, alphaQuality: 90, effort: 6 }).toFile(join(root, "public/hero/croissant-still.webp"));
console.log("✓ public/hero/croissant-still.webp");

const ogPng = join(tmp, "og.png");
shoot("/render/og", ogPng, 1200, 630, false);
await sharp(ogPng).png({ compressionLevel: 9 }).toFile(join(root, "public/og.png"));
console.log("✓ public/og.png");

rmSync(tmp, { recursive: true, force: true });

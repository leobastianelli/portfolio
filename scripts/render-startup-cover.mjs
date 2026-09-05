import { chromium } from "playwright";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";

function readArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) args[key] = true;
    else {
      args[key] = value;
      index += 1;
    }
  }
  return args;
}

const args = readArgs(process.argv.slice(2));
if (typeof args.input !== "string" || typeof args.output !== "string") {
  console.error("Uso: npm run render-cover -- --input captura.png --output portada.png --domain example.com");
  process.exit(1);
}

const inputPath = path.resolve(args.input);
const outputPath = path.resolve(args.output);
const domain = typeof args.domain === "string" ? args.domain : "product.example.com";
const image = await readFile(inputPath);
const imageUrl = `data:image/png;base64,${image.toString("base64")}`;
await mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  await page.setContent(`<!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          html, body { width: 100%; height: 100%; margin: 0; }
          body {
            overflow: hidden;
            background:
              radial-gradient(circle at 11% 18%, rgba(82, 58, 158, 0.24), transparent 30%),
              radial-gradient(circle at 91% 84%, rgba(141, 115, 230, 0.18), transparent 28%),
              linear-gradient(135deg, #fcfbff 0%, #fafaf9 46%, #f2eefb 100%);
            font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          }
          body::before {
            content: "";
            position: absolute;
            inset: 0;
            opacity: 0.2;
            background-image:
              linear-gradient(rgba(82, 58, 158, 0.09) 1px, transparent 1px),
              linear-gradient(90deg, rgba(82, 58, 158, 0.09) 1px, transparent 1px);
            background-size: 56px 56px;
            mask-image: radial-gradient(circle at center, black, transparent 76%);
          }
          .stage {
            position: relative;
            width: 100%;
            height: 100%;
            display: grid;
            place-items: center;
          }
          .glow {
            position: absolute;
            width: 1180px;
            height: 760px;
            border-radius: 50%;
            background: rgba(82, 58, 158, 0.2);
            filter: blur(90px);
          }
          .accent-plane {
            position: absolute;
            width: 1370px;
            height: 870px;
            border: 1px solid rgba(82, 58, 158, 0.26);
            border-radius: 28px;
            background: linear-gradient(145deg, rgba(82, 58, 158, 0.21), rgba(141, 115, 230, 0.08));
            transform: translate(-30px, 18px) rotate(-1.6deg);
          }
          .browser {
            position: relative;
            width: 1400px;
            overflow: hidden;
            border: 1px solid rgba(23, 23, 23, 0.15);
            border-radius: 20px;
            background: #fff;
            box-shadow:
              0 42px 90px rgba(37, 27, 72, 0.22),
              0 12px 28px rgba(23, 23, 23, 0.12),
              0 2px 4px rgba(23, 23, 23, 0.08);
          }
          .chrome {
            height: 58px;
            display: grid;
            grid-template-columns: 150px 1fr 150px;
            align-items: center;
            padding: 0 20px;
            border-bottom: 1px solid rgba(23, 23, 23, 0.1);
            background: rgba(255, 255, 255, 0.98);
          }
          .dots { display: flex; gap: 9px; }
          .dot { width: 12px; height: 12px; border-radius: 999px; }
          .dot:nth-child(1) { background: #ff6258; }
          .dot:nth-child(2) { background: #ffbd2e; }
          .dot:nth-child(3) { background: #28c840; }
          .address {
            justify-self: center;
            min-width: 460px;
            padding: 9px 28px;
            border: 1px solid rgba(23, 23, 23, 0.08);
            border-radius: 999px;
            background: #f5f5f4;
            color: #656565;
            font-size: 13px;
            letter-spacing: 0.01em;
            text-align: center;
          }
          .actions {
            justify-self: end;
            display: flex;
            gap: 8px;
          }
          .action {
            width: 9px;
            height: 9px;
            border: 1px solid rgba(82, 58, 158, 0.44);
            border-radius: 2px;
          }
          .screen {
            display: block;
            width: 100%;
            aspect-ratio: 16 / 10;
            object-fit: cover;
            object-position: center top;
          }
        </style>
      </head>
      <body>
        <main class="stage">
          <div class="glow" aria-hidden="true"></div>
          <div class="accent-plane" aria-hidden="true"></div>
          <section class="browser" aria-label="Vista del producto en navegador">
            <div class="chrome">
              <div class="dots" aria-hidden="true"><i class="dot"></i><i class="dot"></i><i class="dot"></i></div>
              <div class="address">${domain.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</div>
              <div class="actions" aria-hidden="true"><i class="action"></i><i class="action"></i></div>
            </div>
            <img class="screen" src="${imageUrl}" alt="" />
          </section>
        </main>
      </body>
    </html>`, { waitUntil: "load" });

  await page.screenshot({
    path: outputPath,
    type: "png",
    animations: "disabled",
    scale: "device",
  });
  console.log(`Portada guardada: ${outputPath}`);
  console.log("Resolución: 3200 × 2000");
} finally {
  await browser.close();
}

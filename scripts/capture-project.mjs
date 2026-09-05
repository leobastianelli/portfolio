import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

function readArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

const args = readArgs(process.argv.slice(2));
const url = args.url;
const output = args.output;

if (typeof url !== "string" || typeof output !== "string") {
  console.error(
    "Uso: npm run capture -- --url https://example.com --output captures/source/proyecto/vista.png",
  );
  process.exit(1);
}

const parsedUrl = new URL(url);
if (!["http:", "https:"].includes(parsedUrl.protocol)) {
  throw new Error("La URL debe usar http o https.");
}

const width = Number(args.width ?? 1600);
const height = Number(args.height ?? 1000);
const dpr = Number(args.dpr ?? 2);
const delay = Number(args.delay ?? 1500);

if (![width, height, dpr, delay].every(Number.isFinite)) {
  throw new Error("width, height, dpr y delay deben ser números válidos.");
}

const outputPath = path.resolve(output);
await mkdir(path.dirname(outputPath), { recursive: true });

const contextOptions = {
  viewport: { width, height },
  deviceScaleFactor: dpr,
  colorScheme: "light",
  reducedMotion: "reduce",
  locale: args.locale === true ? "en-US" : (args.locale ?? "en-US"),
};

let browser;
let context;

if (typeof args.profile === "string") {
  const profilePath = path.resolve(args.profile);
  await mkdir(profilePath, { recursive: true });
  context = await chromium.launchPersistentContext(profilePath, {
    ...contextOptions,
    headless: args.headed !== true,
    channel: typeof args.channel === "string" ? args.channel : undefined,
    args: typeof args["profile-directory"] === "string"
      ? [`--profile-directory=${args["profile-directory"]}`]
      : undefined,
  });
} else {
  browser = await chromium.launch({ headless: args.headed !== true });
  context = await browser.newContext(contextOptions);
}

try {
  let page = context.pages()[0] ?? await context.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });

  if (args.interactive === true) {
    if (args.headed !== true) {
      throw new Error("El modo --interactive requiere --headed.");
    }
    console.log("Navegá hasta el estado que querés capturar y presioná Enter en esta terminal.");
    await new Promise((resolve) => process.stdin.once("data", resolve));
    page = context.pages().findLast((candidate) => !candidate.isClosed()) ?? page;
  }

  if (page.isClosed()) throw new Error("No quedó ninguna pestaña abierta para capturar.");

  if (typeof args["click-text"] === "string") {
    const clickCount = Number(args["click-count"] ?? 1);
    if (!Number.isInteger(clickCount) || clickCount < 1) {
      throw new Error("--click-count debe ser un entero positivo.");
    }
    for (let index = 0; index < clickCount; index += 1) {
      await page.getByRole("button", { name: args["click-text"], exact: true }).click();
      await page.waitForTimeout(600);
    }
  }

  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        caret-color: transparent !important;
        transition: none !important;
      }
    `,
  });

  if (typeof args.selector === "string") {
    await page.locator(args.selector).first().waitFor({ state: "visible", timeout: 30_000 });
  }

  if (args.redact === true) {
    await page.addStyleTag({
      content: `
        input[type="email"],
        input[name*="email" i], input[id*="email" i],
        input[name*="nombre" i], input[id*="nombre" i],
        input[name*="apellido" i], input[id*="apellido" i],
        input[name*="dni" i], input[id*="dni" i] {
          color: transparent !important;
          text-shadow: 0 0 12px rgba(23, 23, 23, 0.6) !important;
        }
      `,
    });
    await page.locator('input:not([type="checkbox"]):not([type="file"])').evaluateAll((inputs) => {
      for (const input of inputs) {
        input.style.setProperty("color", "transparent", "important");
        input.style.setProperty("text-shadow", "0 0 12px rgba(23, 23, 23, 0.6)", "important");
      }
    });
  }

  if (typeof args["hide-heading"] === "string") {
    const heading = page.getByRole("heading", { name: args["hide-heading"], exact: true });
    await heading.evaluate((element) => {
      const container = element.closest("section") ?? element.parentElement;
      container?.style.setProperty("display", "none", "important");
    });
  }

  if (typeof args["scroll-y"] === "string") {
    const scrollY = Number(args["scroll-y"]);
    if (!Number.isFinite(scrollY)) throw new Error("--scroll-y debe ser un número válido.");
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), scrollY);
  }

  await page.waitForTimeout(delay);
  await page.screenshot({
    path: outputPath,
    type: "png",
    fullPage: args["full-page"] === true,
    animations: "disabled",
    scale: "device",
  });

  console.log(`Captura guardada: ${outputPath}`);
  console.log(`Resolución física: ${width * dpr} × ${height * dpr}`);
} finally {
  await context.close();
  await browser?.close();
}

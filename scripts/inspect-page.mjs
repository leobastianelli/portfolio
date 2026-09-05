import { chromium } from "playwright";
import path from "node:path";

const [url, profile] = process.argv.slice(2);
if (!url) {
  console.error("Uso: node scripts/inspect-page.mjs <url> [profile]");
  process.exit(1);
}

const contextOptions = {
  headless: true,
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
  locale: "es-AR",
  reducedMotion: "reduce",
};

let browser;
let context;
if (profile) context = await chromium.launchPersistentContext(path.resolve(profile), contextOptions);
else {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext(contextOptions);
}

try {
  const page = context.pages()[0] ?? await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

  const structure = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    headings: [...document.querySelectorAll("h1, h2, h3")]
      .map((element) => ({
        text: element.textContent?.trim() || "",
        tag: element.tagName.toLowerCase(),
        className: typeof element.className === "string" ? element.className : "",
        parentTag: element.parentElement?.tagName.toLowerCase() || "",
        parentClass: typeof element.parentElement?.className === "string"
          ? element.parentElement.className
          : "",
      }))
      .filter((heading) => heading.text),
    navigation: [...document.querySelectorAll("nav a")].map((anchor) => ({
      label: anchor.textContent?.trim() || anchor.getAttribute("aria-label") || "",
      href: anchor.getAttribute("href") || "",
    })),
    buttons: [...document.querySelectorAll("button")]
      .map((button) => button.textContent?.trim() || button.getAttribute("aria-label") || "")
      .filter(Boolean),
    controls: [...document.querySelectorAll("input, select, textarea")].map((control) => ({
      tag: control.tagName.toLowerCase(),
      type: control.getAttribute("type") || "",
      name: control.getAttribute("name") || "",
      placeholder: control.getAttribute("placeholder") || "",
      disabled: control.disabled,
    })),
    documentHeight: document.documentElement.scrollHeight,
  }));

  console.log(JSON.stringify(structure, null, 2));
} finally {
  await context.close();
  await browser?.close();
}

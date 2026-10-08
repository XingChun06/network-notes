import { chromium } from "file:///C:/Users/dbRya/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const results = [];

async function inspectPage(name, url, viewport, screenshotPath, viewportScreenshotPath) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const consoleErrors = [];
  const failedRequests = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.url()} :: ${request.failure()?.errorText ?? "unknown"}`);
  });

  const response = await page.goto(url, { waitUntil: "networkidle" });
  const metrics = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.trim() ?? "",
    images: Array.from(document.images).map((image) => ({
      src: image.getAttribute("src"),
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      alt: image.alt,
    })),
    internalLinks: Array.from(document.querySelectorAll('a[href]:not([href^="http"])')).length,
    externalLinks: Array.from(document.querySelectorAll('a[href^="http"]')).length,
    brokenFragmentLinks: Array.from(document.querySelectorAll('a[href^="#"]'))
      .map((link) => link.getAttribute("href"))
      .filter((href) => href && !document.querySelector(href)),
    missingImageAlts: Array.from(document.images)
      .filter((image) => !image.alt.trim())
      .map((image) => image.getAttribute("src")),
    unsafeBlankTargets: Array.from(document.querySelectorAll('a[target="_blank"]'))
      .filter((link) => !link.relList.contains("noopener"))
      .map((link) => link.getAttribute("href")),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));

  await page.screenshot({ path: screenshotPath, fullPage: true });
  if (viewportScreenshotPath) {
    await page.screenshot({ path: viewportScreenshotPath, fullPage: false });
  }
  let mobileMenu = null;
  if (viewport.width <= 800) {
    await page.locator("[data-menu-button]").click();
    mobileMenu = {
      expanded: await page.locator("[data-menu-button]").getAttribute("aria-expanded"),
      visible: await page.locator("[data-nav]").isVisible(),
    };
  }
  results.push({
    name,
    status: response?.status(),
    viewport,
    consoleErrors,
    failedRequests,
    mobileMenu,
    ...metrics,
  });
  await page.close();
}

await inspectPage(
  "home-desktop",
  "http://127.0.0.1:8000/",
  { width: 1440, height: 900 },
  "../report/screenshots/home-desktop.png",
  "../report/screenshots/home-desktop-viewport.png",
);

await inspectPage(
  "home-mobile",
  "http://127.0.0.1:8000/",
  { width: 390, height: 844 },
  "../report/screenshots/home-mobile.png",
  "../report/screenshots/home-mobile-viewport.png",
);

await inspectPage(
  "article-desktop",
  "http://127.0.0.1:8000/posts/a-web-request.html",
  { width: 1440, height: 900 },
  "../report/screenshots/article-desktop.png",
);

console.log(JSON.stringify(results, null, 2));
await browser.close();

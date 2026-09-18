import { chromium } from "playwright";
const outDir = "C:\\Users\\USER\\AppData\\Local\\Temp\\claude\\D--agukafinance-agukafinance\\82cbee31-6fa4-491c-97cf-9e89108380d3\\scratchpad";
const browser = await chromium.launch();
// hasTouch:false + isMobile:false ensures matchMedia('pointer: fine') is true in Chromium.
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (msg) => { if (msg.type() === "error") errors.push(msg.text()); });
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await page.waitForSelector("text=HOW WE CAN HELP");
const reject = page.locator("button:has-text('Reject')");
if (await reject.count()) await reject.click().catch(() => {});
await page.waitForTimeout(500);

// Check the has-custom-cursor class got applied after a mouse move.
await page.mouse.move(300, 300);
await page.waitForTimeout(300);
const hasClass = await page.evaluate(() => document.documentElement.classList.contains("has-custom-cursor"));
console.log("has-custom-cursor class applied:", hasClass);

// Screenshot cursor as a plain dot over a neutral area.
await page.mouse.move(700, 400, { steps: 10 });
await page.waitForTimeout(300);
await page.screenshot({ path: `${outDir}/cursor-dot.png` });

// Hover over a button to trigger the "zoom" growth.
const ctaButton = page.locator("text=Check Quote Today").first();
const box = await ctaButton.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 15 });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/cursor-hover.png` });
}

// Trust band section (compact quote check).
await page.evaluate(() => document.querySelector("blockquote").scrollIntoView({ block: "center" }));
await page.waitForTimeout(600);
await page.mouse.move(200, 500);
await page.waitForTimeout(300);
await page.screenshot({ path: `${outDir}/trustband-v2.png` });

console.log("errors:", errors);
await browser.close();

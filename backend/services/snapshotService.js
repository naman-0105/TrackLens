import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const SCREENSHOT_DIR = path.join(process.cwd(), "public", "screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, {
    recursive: true,
  });
}

export const captureScreenshot = async (url) => {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage({
      viewport: {
        width: 1440,
        height: 900,
      },
    });

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    const fileName = `${Date.now()}.png`;

    const filePath = path.join(SCREENSHOT_DIR, fileName);

    await page.screenshot({
      path: filePath,
      fullPage: true,
    });

    return `/screenshots/${fileName}`;
  } finally {
    await browser.close();
  }
};

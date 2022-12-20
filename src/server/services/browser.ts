import { env } from "@/env/server.mjs";
import puppeteer from "puppeteer-core";

export async function getBrowser() {
  if (env.NODE_ENV === "production") {
    return puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${env.BROWSERLESS_API_KEY}`,
    });
  }

  return puppeteer.launch({
    headless: true,
    args: [],
    executablePath:
      process.platform === "win32"
        ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
        : process.platform === "linux"
        ? "/usr/bin/google-chrome"
        : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
}

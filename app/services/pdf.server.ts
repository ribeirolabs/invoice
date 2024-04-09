import puppeteer from "puppeteer-core";
import { ENV } from "~/env.server";
import { cookieToObject } from "~/utils";

export function getBrowser() {
  if (ENV.NODE_ENV === "production") {
    return puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${ENV.BROWSERLESS_API_KEY}`,
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

export async function generatePdf({
  invoiceId,
  request,
}: {
  invoiceId: string;
  request: Request;
}) {
  const domain = ENV.DOMAIN ?? new URL(request.url).origin;
  const cookies = cookieToObject(request.headers.get("Cookie") ?? "");

  if (!domain) {
    throw new Response("Unable to get domain from headers", {
      status: 400,
    });
  }

  const url = new URL(`/invoice/${invoiceId}`, domain);

  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setCookie(
    ...Object.keys(cookies).map((name) => ({
      name,
      value: cookies[name] as string,
      path: "/",
      domain: url.host,
      secure: true,
    }))
  );
  await page.goto(url.toString(), { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "a4",
    printBackground: true,
    margin: {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
    },
  });

  await browser.close();

  return pdf;
}

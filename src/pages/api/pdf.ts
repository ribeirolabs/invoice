import { NextApiRequest, NextApiResponse } from "next";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { z } from "zod";

const requestSchema = z.object({
  url: z.string(),
  locale: z.string(),
});

export default async function pdf(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).send(`Invalid method: ${req.method}`);
    return;
  }

  const body = requestSchema.safeParse(req.body);

  if (!body.success) {
    res.status(400).json(body.error.errors);
    return;
  }
  const options = process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      }
    : {
        args: [],
        executablePath:
          process.platform === "win32"
            ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            : process.platform === "linux"
            ? "/usr/bin/google-chrome"
            : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      };
  const browser = await puppeteer.launch(options);

  // const browser = await chromium.puppeteer.launch({
  //   args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
  //   defaultViewport: chromium.defaultViewport,
  //   executablePath: await chromium.executablePath,
  //   headless: true,
  //   ignoreHTTPSErrors: true,
  // });
  // const context = await browser.newContext({ locale: body.data.locale });
  const cookies = Object.keys(req.cookies).map((name) => ({
    name,
    value: req.cookies[name] as string,
    path: "/",
    domain: new URL(body.data.url).hostname,
    secure: true,
  }));

  // context.addCookies(cookies);

  const page = await browser.newPage();
  await page.setCookie(...cookies);

  await page.goto(body.data.url, { waitUntil: "networkidle0" });
  // await page.emulateMedia({ media: "print" });
  const pdf = await page.pdf({
    format: "a4",
    printBackground: true,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Length", pdf.length);
  res.send(pdf);

  await browser.close();

  res.end();
}

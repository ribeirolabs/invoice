import { NextApiRequest, NextApiResponse } from "next";
import { launchChromium } from "playwright-aws-lambda";
import { z } from "zod";

const requestSchema = z.object({
  url: z.string(),
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

  const browser = await launchChromium({
    headless: true,
  });
  const context = await browser.newContext({});
  const cookies = Object.keys(req.cookies).map((name) => ({
    name,
    value: req.cookies[name] as string,
    path: "/",
    domain: new URL(body.data.url).hostname,
    secure: true,
  }));

  context.addCookies(cookies);

  const page = await context.newPage();
  await page.goto(body.data.url);
  await page.emulateMedia({ media: "print" });
  await page.waitForLoadState("networkidle");
  const pdf = await page.pdf({
    format: "a4",
    printBackground: true,
  });

  page.on("console", console.log);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Length", pdf.length);
  res.send(pdf);

  await browser.close();

  res.end();
}

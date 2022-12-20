import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export async function generatePdf({
  id,
  domain,
  cookies,
}: {
  id: string;
  domain: string;
  cookies: Partial<Record<string, string>>;
}) {
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

  const url = new URL(`/invoice/${id}`, domain);

  const browser = await puppeteer.launch(options);
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

import { getBrowser } from "./browser";

export async function generatePdf({
  id,
  domain,
  cookies,
}: {
  id: string;
  domain: string;
  cookies: Partial<Record<string, string>>;
}) {
  const url = new URL(`/invoice/${id}`, domain);

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

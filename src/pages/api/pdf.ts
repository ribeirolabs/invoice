import { generatePdf } from "@/server/services/pdf";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const requestSchema = z.object({
  id: z.string(),
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

  const domain = req.headers.origin;

  if (!domain) {
    res.status(400).send({ error: "Unable to get domain from headers" });
    return;
  }

  const pdf = await generatePdf({
    id: body.data.id,
    cookies: req.cookies,
    domain,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Length", pdf.length);
  res.send(pdf);

  res.end();
}

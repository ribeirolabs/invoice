import { env } from "@/env/server.mjs";
import { Invoice } from "@prisma/client";
import format from "date-fns/format";
import mailgun from "mailgun-js";
import { NextApiRequest } from "next";
import { generatePdf } from "./pdf";

const client = mailgun({
  apiKey: env.EMAIL_API_KEY,
  domain: env.EMAIL_API_DOMAIN,
});

export async function sendInvoiceEmail({
  invoice,
  req,
}: {
  invoice: Invoice & {
    payer: { name: string; email: string; currency: string };
    receiver: { name: string; email: string };
  };
  req: NextApiRequest;
}) {
  const pdf = await generatePdf({
    id: invoice.id,
    domain: req.headers.origin!,
    cookies: req.cookies,
  });

  const data = {
    from: `${invoice.receiver.name} <mailgun@${env.EMAIL_API_DOMAIN}>`,
    to: [invoice.payer.email, invoice.receiver.email],
    subject: `Invoice - ${invoice.receiver.name}`,
    template: "send-invoice",
    "h:Reply-To": invoice.receiver.email,
    "h:X-Mailgun-Variables": JSON.stringify({
      invoice_number: invoice.number,
      invoice_due_date: format(invoice.expiredAt, "yyyy/MM/dd"),
      invoice_description: invoice.description,
      payer_name: invoice.payer.name,
      payer_email: invoice.payer.email,
      receiver_name: invoice.receiver.name,
      receiver_email: invoice.receiver.email,
    }),
    attachment: new client.Attachment({
      data: pdf,
      filename: `${invoice.number}.pdf`,
      contentType: "application/pdf",
    }),
  };

  return new Promise((resolve, reject) =>
    client.messages().send(data, (error, body) => {
      if (error) {
        reject(error.message);
        return;
      }

      resolve(body.message);
    })
  );
}

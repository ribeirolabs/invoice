import { env } from "@/env/server.mjs";
import { getCurrencySymbol } from "@/utils/currency";
import { Invoice } from "@prisma/client";
import format from "date-fns/format";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { MailgunMessageData } from "mailgun.js/interfaces/Messages";
import { NextApiRequest } from "next";
import { generatePdf } from "./pdf";

const mg = new Mailgun(formData);

const client = mg.client({
  username: "api",
  key: env.EMAIL_API_KEY,
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
  if (!req.headers.origin) {
    throw new Error('Unable to generate PDF, missing "origin" from request');
  }

  const pdf = await generatePdf({
    id: invoice.id,
    domain: req.headers.origin,
    cookies: req.cookies,
  });

  const data: MailgunMessageData = {
    from: `${invoice.receiver.name} <${env.EMAIL_API_SENDER}>`,
    to: invoice.payer.email,
    cc: invoice.receiver.email,
    subject: `Invoice from: ${invoice.receiver.name}`,
    template: "invoice.send-invoice",
    "h:Reply-To": invoice.receiver.email,
    "h:X-Mailgun-Variables": JSON.stringify({
      invoice_number: invoice.number,
      invoice_currency: getCurrencySymbol(invoice.currency),
      invoice_date: format(invoice.issuedAt, "yyyy/MM/dd"),
      invoice_due_date: format(invoice.expiredAt, "yyyy/MM/dd"),
      invoice_description: invoice.description,
      payer_name: invoice.payer.name,
      payer_email: invoice.payer.email,
      receiver_name: invoice.receiver.name,
      receiver_email: invoice.receiver.email,
    }),
    attachment: {
      data: pdf,
      filename: `${invoice.number}.pdf`,
      contentType: "application/pdf",
    },
  };

  return await client.messages.create(env.EMAIL_API_DOMAIN, data);
}

import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { renderToStaticMarkup } from "react-dom/server";
import invariant from "tiny-invariant";
import { InvoiceFull, getDetailedInvoice } from "~/data/invoice.server";
import { InvoiceEmail } from "~/emails/Invoice";
import { ENV } from "~/env";
import { requireUser } from "~/services/auth.server";
import { sendEmail } from "~/services/email.server";
import { generatePdf } from "~/services/pdf.server";
import prisma from "~/services/prisma.server";

async function getInvoiceHtml(invoice: InvoiceFull): Promise<string> {
  const html = renderToStaticMarkup(
    <InvoiceEmail domain={ENV.DOMAIN} invoice={invoice} />
  );

  return html;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  invariant(params.id, "Missing invoice id");

  const invoice = await getDetailedInvoice(params.id, user.id);

  if (!invoice) {
    throw new Response("Invoice not found", {
      status: 404,
    });
  }

  const html = await getInvoiceHtml(invoice);

  return new Response(html, {
    headers: {
      "Content-type": "text/html",
    },
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await requireUser(request);
  invariant(params.id, "Missing invoice id");

  const invoice = await getDetailedInvoice(params.id, user.id);

  if (!invoice) {
    return json(
      {
        success: false,
        message: "Invoice not found",
      },
      {
        status: 404,
      }
    );
  }

  try {
    const pdf = await generatePdf({
      invoiceId: params.id,
      request,
    }).catch((e) => {
      throw new Error(`Unable to generate PDF: ${e}`);
    });

    const html = await getInvoiceHtml(invoice).catch((e) => {
      throw new Error(`Unable to get invoice HTML: ${e}`);
    });

    const response = await sendEmail({
      user,
      toEmail: invoice.payer.email,
      subject: `Invoice from: ${invoice.receiver.name}`,
      content: html,
      attachments: [
        {
          filename: getInvoiceFilename(invoice),
          content: pdf,
        },
      ],
    }).catch((e) => {
      throw new Error(`Unable to send email: ${e}`);
    });

    await prisma.invoiceEmailHistory.create({
      data: {
        provider: "google",
        email: invoice.payer.email,
        invoiceId: invoice.id,
        data: {
          id: response.id,
          threadId: response.threadId,
          date: response.internalDate,
          historyId: response.historyId,
          from: user.email,
        },
      },
    });

    return json({
      success: true,
    });
  } catch (e: any) {
    return json(
      {
        success: false,
        message: e.message,
      },
      {
        status: 500,
      }
    );
  }
}

function getInvoiceFilename(invoice: { number: string }) {
  return `${invoice.number.replace(/[^a-z0-9_-]/gi, "_")}.pdf`;
}

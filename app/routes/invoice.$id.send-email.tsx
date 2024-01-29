import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { requireUser } from "~/services/auth.server";
import { sendEmail } from "~/services/email.server";
import { generatePdf } from "~/services/pdf.server";
import prisma from "~/services/prisma.server";
import { redirectBack } from "~/utils.server";

export function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response(null, {
      status: 400,
      statusText: "Missing invoice id",
    });
  }

  return redirect(`/invoice/${params.id}`);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const invoiceId = params.id;
  const user = await requireUser(request);

  if (!invoiceId) {
    throw new Response(null, {
      status: 400,
      statusText: "Missing invoice id",
    });
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId },
  });

  if (!invoice) {
    throw new Response(null, {
      status: 404,
      statusText: "Invoice not found",
    });
  }

  const pdf = await generatePdf({
    invoiceId: invoice.id,
    request,
  });

  await sendEmail({
    user,
    to: "igor.ribeiro.plus@gmail.com",
    subject: `Invoice from ${user.name}`,
    content: `Invoice ${invoice.number}`,
    attachments: [{ filename: `invoice-${invoice.id}.pdf`, content: pdf }],
  });

  return redirectBack(request);
}

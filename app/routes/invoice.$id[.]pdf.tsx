import { LoaderFunctionArgs } from "@remix-run/node";
import { ENV } from "~/env";
import { generatePdf } from "~/services/pdf.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Missing invoice id", {
      status: 400,
    });
  }

  const domain = ENV.DOMAIN ?? new URL(request.url).origin;

  if (!domain) {
    throw new Response("Unable to get domain from headers", {
      status: 400,
    });
  }

  const pdf = await generatePdf({
    invoiceId: params.id,
    request,
  });

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.length),
    },
  });
}

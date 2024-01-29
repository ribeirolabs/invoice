import { json, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "react-router";
import { requireUser } from "~/services/auth.server";
import prisma from "~/services/prisma.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  if (!params.id) {
    throw new Response(null, {
      status: 400,
      statusText: "Missing invoice id",
    });
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  if (!invoice) {
    throw new Response(null, {
      status: 404,
      statusText: "Invoice not found",
    });
  }

  return json({
    invoice,
  });
}

export default function Page() {
  const { invoice } = useLoaderData<typeof loader>();

  return <h1>{invoice.number}</h1>;
}

import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { AUTH_INTENTS } from "~/intents";
import { authenticator } from "~/services/auth.server";
import prisma from "~/services/prisma.server";

export const meta: MetaFunction = () => {
  return [{ title: "ribeirolabs / invoice" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    throw redirect("/login", {
      status: 401,
    });
  }

  const invoices = await prisma.invoice.findMany({
    select: {
      id: true,
      number: true,
    },
    take: 10,
    where: {
      userId: user.id,
    },
  });

  return {
    user,
    invoices,
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>ribeirolabs / invoice</h1>
      <h3>Welcome, {data.user.email}</h3>

      <Form action="/auth/google" method="post">
        <button name="intent" value={AUTH_INTENTS.logout}>
          Logout
        </button>
      </Form>

      <a href="/email">Email</a>

      <h2>Invoices</h2>
      <ul>
        {data.invoices.map((invoice) => (
          <li key={invoice.id}>
            <Form action={`/invoice/${invoice.id}/send-email`} method="post">
              <a href={`/invoice/${invoice.id}`}>{invoice.number}</a>
              {" / "}
              <button>Email</button>
            </Form>
          </li>
        ))}
      </ul>
    </div>
  );
}

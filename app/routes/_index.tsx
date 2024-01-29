import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
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
    where: {
      userId: user.id,
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
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
      <header className="p-4 bg-neutral-800 flex justify-between">
        <h1 className="font-black text-2xl font-serif">
          <span className="text-neutral-500">ribeirolabs</span>
          <span className="text-primary"> / invoice</span>
        </h1>

        <div className="flex items-center justify-center gap-2">
          <h3 className="-font-bold">{data.user.name}</h3>
          <a href="/logout" className="btn btn-tertiary btn-sm">
            Logout
          </a>
        </div>
      </header>

      <main className="p-4">
        <h2 className="font-serif text-3xl font-black">Invoices</h2>
        <div className="divider" />
        <ul className="flex flex-col gap-2">
          {data.invoices.map((invoice) => (
            <li key={invoice.id}>
              <Form action={`/invoice/${invoice.id}/send-email`} method="post">
                <a href={`/invoice/${invoice.id}`}>{invoice.number}</a>
                {" / "}
                <button className="btn btn-ghost btn-sm">Email</button>
              </Form>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { DocumentPlusIcon, PlusIcon, SparkleIcon } from "~/components/Icons";
import { getRecentInvoicesGrouped } from "~/data/invoice.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Header } from "~/components/Header";
import { HeroIcon } from "~/components/HeroIcon";
import { Card } from "~/components/Card";
import { InvoiceCard } from "~/components/InvoiceCard";

export const meta: MetaFunction = () => {
  return [{ title: "ribeirolabs / invoice" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    throw redirect("/login");
  }

  const invoices = await getRecentInvoicesGrouped(user.id);

  return typedjson({
    user,
    invoices,
  });
}

export default function Index() {
  const data = useTypedLoaderData<typeof loader>();

  return (
    <div>
      <Header user={data.user} />
      <PendingSection />
      <RecentSection />
    </div>
  );
}

function PendingSection() {
  const { invoices } = useTypedLoaderData<typeof loader>();

  return (
    <div
      className="pt-10 pb-6 bg-gradient-to-br from-primary to-secondary overflow-hidden"
      data-theme="light"
    >
      <div className="max-content">
        <div className="grid md:grid-cols-2 gap-2">
          {invoices.pending.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}

          {invoices.pending.length === 0 && (
            <Card className="p-3 flex gap-4 items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl">
                  Nenhuma pendência
                </h3>
                <p className="text-dim leading-tight">
                  Aqui você poderá consultar as invoices não foram concluídas.
                </p>
              </div>
              <HeroIcon icon={SparkleIcon} className="text-neutral-400" />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentSection() {
  const { invoices } = useTypedLoaderData<typeof loader>();

  return (
    <main className="p-4 max-content">
      <h2 className="font-serif text-2xl font-black mb-2">Últimas Invoices</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {invoices.fullfilled.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}

        {invoices.fullfilled.length === 0 && (
          <Card className="flex p-3 gap-3 items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold">Nenhuma invoice</h3>
              <p>
                <a
                  href="/generate"
                  className="font-medium underline text-secondary"
                >
                  Adicione
                </a>{" "}
                <span className="text-dim">sua primeira invoice.</span>
              </p>
            </div>

            <HeroIcon icon={DocumentPlusIcon} className="opacity-50" />
          </Card>
        )}
      </div>
    </main>
  );
}

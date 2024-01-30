import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { DocumentPlusIcon, SparkleIcon } from "~/components/Icons";
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
      className="py-6 bg-gradient-to-br from-primary to-secondary overflow-hidden"
      data-theme="light"
    >
      <div className="max-content">
        {invoices.pending.length ? (
          <ul className="grid lg:grid-cols-2 gap-2">
            {invoices.pending.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </ul>
        ) : (
          <Card>
            <div className="flex gap-4 items-center">
              <HeroIcon icon={SparkleIcon} className="text-neutral-400" />

              <div>
                <h3 className="font-serif font-bold text-xl">
                  Tudo certo por aqui!
                </h3>
                <p className="text-dim">Você não tem invoices pendentes</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function RecentSection() {
  const { invoices } = useTypedLoaderData<typeof loader>();

  return (
    <main className="p-4 max-content">
      <h2 className="font-serif text-2xl font-black mb-2">Recentes</h2>
      <div className="grid gap-3">
        {invoices.fullfilled.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}

        {invoices.fullfilled.length === 0 && (
          <Card className="flex gap-3 items-center">
            <HeroIcon icon={DocumentPlusIcon} className="opacity-50" />
            <div>
              <h3 className="font-serif text-xl font-bold">
                Você não tem invoices.
              </h3>
              <p className="flex gap-1">
                <a href="/generate" className="underline text-secondary">
                  Clique aqui
                </a>
                <span className="text-dim">
                  para gerar sua primeira invoice.
                </span>
              </p>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}

import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { requireUser } from "~/services/auth.server";
import {
  ArrowRightIcon,
  CompaniesIcon,
  DocumentOutlineIcon,
  SparkleIcon,
} from "~/components/Icons";
import {
  getPendingInvoices,
  getRecentFullfilledInvoices,
} from "~/data/invoice.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { HeroIcon } from "~/components/HeroIcon";
import { Card } from "~/components/Card";
import { InvoiceCard } from "~/components/InvoiceCard";
import { getPendingTasks } from "~/services/task.server";
import { TaskSubject } from "@prisma/client";

export const meta: MetaFunction = () => {
  return [{ title: "ribeirolabs / invoice" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  const [invoices, pendingInvoices, tasks] = await Promise.all([
    getRecentFullfilledInvoices(user.id),
    getPendingInvoices(user.id),
    getPendingTasks(user.id),
  ]);

  return typedjson({
    invoices,
    pendingInvoices,
    tasks,
  });
}

export default function Index() {
  return (
    <>
      <PendingSection />
      <RecentSection />
    </>
  );
}

function PendingSection() {
  const { tasks, pendingInvoices } = useTypedLoaderData<typeof loader>();

  return (
    <div
      className="pt-10 pb-6 bg-gradient-to-br from-primary to-secondary overflow-hidden"
      data-theme="light"
    >
      <div className="max-content">
        <h1 className="text-2xl font-bold text-white mb-2">Pendências</h1>

        <div className="grid md:grid-cols-2 gap-2">
          {tasks.map((task) => {
            return (
              <Card
                key={task.id}
                className="p-3 flex justify-between items-start"
              >
                {task.subject === TaskSubject.MissingCompanies ? (
                  <>
                    <div>
                      <h3 className="font-serif font-bold text-xl">
                        Nenhuma empresa
                      </h3>
                      <p className="text-dim leading-tight text-sm">
                        Para criar invoices é necessário que tenha ao menos 1
                        empresa sua e 1 empresa terceira.
                      </p>

                      <div className="h-3" />

                      <a
                        href="/companies/new"
                        className="btn btn-secondary btn-sm btn-outline"
                      >
                        Cadastre uma empresa
                        <ArrowRightIcon className="icon-sm" />
                      </a>
                    </div>

                    <div className="divider divider-horizontal h-full" />

                    <HeroIcon icon={CompaniesIcon} />
                  </>
                ) : null}
              </Card>
            );
          })}

          {pendingInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}

          {tasks.length === 0 && (
            <Card className="p-3 flex gap-4 items-start justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl">
                  Nenhuma pendência
                </h3>
                <p className="text-dim leading-tight text-sm">
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
    <main className="py-8 px-4 max-content">
      <h2 className="text-2xl font-bold mb-4">Últimas Invoices</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}

        {invoices.length === 0 && (
          <Card className="flex p-3 gap-3 items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold">Nenhuma invoice</h3>
              <p className="text-sm">
                <a
                  href="/generate"
                  className="font-medium underline text-secondary"
                >
                  Adicione
                </a>{" "}
                <span className="text-dim">sua primeira invoice.</span>
              </p>
            </div>

            <HeroIcon icon={DocumentOutlineIcon} className="opacity-50" />
          </Card>
        )}
      </div>
    </main>
  );
}

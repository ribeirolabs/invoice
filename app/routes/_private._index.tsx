import { type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { requireUser } from "~/services/auth.server";
import {
  ArrowRightIcon,
  CompaniesIcon,
  DocumentOutlineIcon,
  PlusIcon,
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
import { EmptyState } from "~/components/EmptyState";

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

  if (tasks.length === 0 && pendingInvoices.length === 0) {
    return null;
  }

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
        </div>
      </div>
    </div>
  );
}

function RecentSection() {
  const { invoices } = useTypedLoaderData<typeof loader>();

  return (
    <main className="py-8 px-4 max-content">
      <h2 className="text-2xl font-bold">Últimas Invoices</h2>
      <div className="divider mb-6" />

      <div className="grid md:grid-cols-2 gap-3">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}

        {invoices.length === 0 && (
          <EmptyState
            title="Nenhuma invoice"
            description="Você ainda não criou nenhuma invoice"
            icon={DocumentOutlineIcon}
          >
            <a href="/generate" className="btn btn-sm text-white">
              <PlusIcon className="icon-sm" />
              Criar Invoice
            </a>
          </EmptyState>
        )}
      </div>
    </main>
  );
}

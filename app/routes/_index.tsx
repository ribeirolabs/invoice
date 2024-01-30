import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { cn, dateToDistance, formatCurrency } from "~/utils";
import {
  ArrowDownIcon,
  CalendarIcon,
  DocumentCheckIcon,
  DocumentPlusIcon,
  EmailIcon,
  SendIcon,
  TrashIcon,
} from "~/components/Icons";
import { InvoiceFull, getRecentInvoicesGrouped } from "~/data/invoice.server";
import { InvoiceStatus } from "~/data/invoice";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

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
      <header className="bg-neutral-800 ">
        <div className="p-4 flex items-center justify-between max-content">
          <a href="/" className="text-xl">
            <span className="text-neutral-400">ribeirolabs</span>
            <span className="font-bold text-primary"> / invoice</span>
          </a>

          <div className="flex items-center justify-center gap-2">
            <h3 className="-font-bold">{data.user.name}</h3>
            <a href="/logout" className="btn btn-sm">
              Sair
            </a>
          </div>
        </div>
      </header>

      <PendingSection />

      <main className="p-4 max-content">
        <h2 className="font-serif text-2xl font-black mb-2">Recentes</h2>
        <div className="grid gap-2">
          {data.invoices.fullfilled.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      </main>
    </div>
  );
}

function PendingSection() {
  const data = useTypedLoaderData<typeof loader>();

  if (data.invoices.pending.length === 0) {
    return null;
  }

  return (
    <div
      className="px-4 py-6 bg-gradient-to-br from-primary to-secondary overflow-hidden"
      data-theme="light"
    >
      <div className="max-content">
        <h2 className="font-serif text-2xl font-black mb-2 text-white">
          Pendentes
        </h2>

        <ul className="grid lg:grid-cols-2 gap-2">
          {data.invoices.pending.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function InvoiceCard({ invoice }: { invoice: InvoiceFull }) {
  const isSent = invoice.status === InvoiceStatus.SENT;
  const isPaid = invoice.status === InvoiceStatus.PAID;

  return (
    <div className="p-3 grid light:bg-white bg-neutral-800 rounded light:shadow-lg shadow-black/20 shadow-none overflow-hidden">
      <div className="flex gap-6 items-start">
        <div className="flex items-center justify-center w-18 aspect-square bg-secondary/10 rounded-full relative mb-2">
          {isSent ? (
            <div className="text-secondary">
              <EmailIcon className="icon-2xl" />
              <div className="badge rounded-full badge-secondary font-medium uppercase text-xs absolute bottom-[-10%] left-1/2 -translate-x-1/2 transition-none">
                Enviada
              </div>
            </div>
          ) : isPaid ? (
            <div className="text-primary">
              <DocumentPlusIcon className="icon-xl" />
              <div className="badge rounded-full badge-primary font-medium uppercase text-xs absolute bottom-[-10%] left-1/2 -translate-x-1/2 transition-none">
                Paga
              </div>
            </div>
          ) : (
            <div className="text-secondary">
              <DocumentPlusIcon className="icon-xl" />
              <div className="badge rounded-full badge-secondary font-medium uppercase text-xs absolute bottom-[-10%] left-1/2 -translate-x-1/2 transition-none">
                Criada
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 md:gap-2 flex-1 light:text-neutral-700">
          <div>
            <a
              href={`/invoice/${invoice.id}`}
              className={cn(
                "font-bold",
                isPaid ? "text-white" : "text-secondary"
              )}
            >
              {invoice.number}
            </a>

            <div className="">{formatCurrency(invoice.amount, "USD")}</div>
          </div>

          <div className="flex flex-col gap-2 md:gap-0 md:flex-row -justify-between">
            <div className="flex gap-1 items-center">
              <ArrowDownIcon className="-icon-lg" />
              <div className="flex-col">
                <div className="font-bold">{invoice.payer.alias}</div>
                <div className="text-sm text-dim normal-case">
                  {invoice.receiver.alias}
                </div>
              </div>
            </div>

            <div className="divider divider-horizontal hidden md:flex" />

            <div className="flex gap-1">
              <CalendarIcon />
              <div>
                <div className="font-bold">Vencimento</div>
                <div className="text-dim text-sm">
                  {dateToDistance(invoice.expiredAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="flex gap-2 justify-end">
        {!isPaid && (
          <>
            {!isSent && (
              <button className="btn btn-sm btn-circle btn-secondary-ghost">
                <SendIcon className="icon-sm" />
              </button>
            )}

            <button className="btn btn-sm btn-circle btn-secondary-ghost">
              <DocumentCheckIcon className="icon-sm" />
            </button>
          </>
        )}

        <button className="btn btn-sm btn-circle btn-error btn-outline">
          <TrashIcon className="icon-sm" />
        </button>
      </div>
    </div>
  );
}

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
  IconProps,
  LogoutIcon,
  SendIcon,
  SparkleIcon,
  TrashIcon,
} from "~/components/Icons";
import { InvoiceFull, getRecentInvoicesGrouped } from "~/data/invoice.server";
import { InvoiceStatus } from "~/data/invoice";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ReactNode } from "react";

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
      <header className="bg-neutral-900 ">
        <div className="p-4 flex items-center justify-between max-content">
          <a href="/" className="text-xl">
            <span className="text-neutral-400 hidden md:inline-block">
              ribeirolabs
            </span>
            <span className="text-neutral-400 md:hidden">r</span>
            <span className="font-bold text-primary"> / invoice</span>
          </a>

          <div className="flex items-center justify-center gap-2">
            <h3 className="-font-bold">{data.user.name}</h3>
            <a href="/logout" className="btn btn-sm btn-outline btn-neutral">
              <LogoutIcon className="icon-xs" />
              Sair
            </a>
          </div>
        </div>
      </header>

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
              <HeroIcon icon={SparkleIcon} />

              <div>
                <h3 className="font-serif font-bold text-xl">
                  Tudo certo por aqui!
                </h3>
                <p className="text-dim">
                  Você não tem invoices pendentes
                </p>
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
            <HeroIcon icon={DocumentPlusIcon} />
            <div>
              <h3 className="font-serif text-xl font-bold">
                Você não tem invoices.
              </h3>
              <a href="/generate" className="btn btn-sm btn-primary">
                Gerar nova
              </a>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}

function InvoiceCard({ invoice }: { invoice: InvoiceFull }) {
  const isSent = invoice.status === InvoiceStatus.SENT;
  const isPaid = invoice.status === InvoiceStatus.PAID;

  return (
    <Card>
      <div className="flex gap-6 items-start">
        {isSent ? (
          <HeroIcon
            className="hero-icon-secondary"
            label="Enviada"
            icon={EmailIcon}
          />
        ) : isPaid ? (
          <HeroIcon
            className="hero-icon-primary"
            label="Paga"
            icon={DocumentCheckIcon}
          />
        ) : (
          <HeroIcon
            className="bg-secondary/20 text-secondary"
            label="Criada"
            icon={DocumentPlusIcon}
          />
        )}

        <div className="flex flex-col gap-3 flex-1 light:text-neutral-700">
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
              <div
                className="tooltip"
                data-tip={(isPaid
                  ? invoice.fullfilledAt
                  : invoice.expiredAt
                )?.toLocaleDateString()}
              >
                <div className="font-bold">
                  {isPaid ? "Pagamento" : "Vencimento"}
                </div>
                <div className="text-dim text-sm">
                  {dateToDistance(invoice.fullfilledAt ?? invoice.expiredAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="flex gap-2 items-center justify-between">
        <div
          className="tooltip"
          data-tip={invoice.issuedAt.toLocaleDateString()}
        >
          <p className="text-xs text-dimmer">
            Emitida {dateToDistance(invoice.issuedAt)}
          </p>
        </div>
        <div className="flex gap-2 justify-between">
          {!isPaid && (
            <>
              {!isSent && (
                <button
                  className="btn btn-sm btn-circle btn-secondary-ghost tooltip"
                  data-tip="Enviar"
                >
                  <SendIcon className="icon-sm" />
                </button>
              )}

              <button
                className="btn btn-sm btn-circle btn-secondary-ghost tooltip"
                data-tip="Paga"
              >
                <DocumentCheckIcon className="icon-sm" />
              </button>
            </>
          )}

          <button
            className="btn btn-sm btn-circle btn-error btn-outline tooltip"
            data-tip="Remover"
          >
            <TrashIcon className="icon-sm" />
          </button>
        </div>
      </div>
    </Card>
  );
}

function Card({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-3 light:bg-white bg-neutral-800 rounded light:shadow-lg shadow-black/20 shadow-none",
        className
      )}
    >
      {children}
    </div>
  );
}

function HeroIcon({
  className,
  icon,
  label,
}: {
  className?: string;
  icon: (props: IconProps) => JSX.Element;
  label?: string;
}) {
  const Icon = icon;

  return (
    <div
      className={cn(
        "hero-icon flex items-center justify-center w-18 aspect-square rounded-full relative flex-shrink-0 flex-grow-0",
        label && "mb-2",
        className
      )}
    >
      <Icon className="icon-2xl" />

      {label && (
        <div className="badge rounded-full font-medium uppercase text-xs absolute bottom-[-10%] left-1/2 -translate-x-1/2 transition-none">
          {label}
        </div>
      )}
    </div>
  );
}

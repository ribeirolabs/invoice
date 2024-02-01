import { InvoiceStatus } from "~/data/invoice";
import { InvoiceFull } from "~/data/invoice.server";
import { cn, formatCurrency, dateToDistance } from "~/utils";
import { Card } from "./Card";
import { HeroIcon } from "./HeroIcon";
import {
  EmailIcon,
  DocumentCheckIcon,
  DocumentPlusIcon,
  ArrowDownIcon,
  CalendarIcon,
  SendIcon,
  TrashIcon,
} from "./Icons";

export function InvoiceCard({ invoice }: { invoice: InvoiceFull }) {
  const isSent = invoice.status === InvoiceStatus.SENT;
  const isPaid = invoice.status === InvoiceStatus.PAID;

  return (
    <Card>
      <Card.Content className="flex items-start">
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

        <div className="divider divider-horizontal mx-1" />

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

            <div className="leading-none">
              {formatCurrency(invoice.amount, "USD")}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:gap-0 lg:flex-row justify-between">
            <div className="flex gap-1 items-center">
              <ArrowDownIcon className="-icon-lg" />
              <div className="flex-col">
                <div className="font-bold">{invoice.payer.alias}</div>
                <div className="text-sm text-dim normal-case">
                  {invoice.receiver.alias}
                </div>
              </div>
            </div>

            <div className="divider divider-horizontal hidden sm:flex" />

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
      </Card.Content>

      <Card.Footer className="flex gap-2 items-center justify-between">
        <div
          className="tooltip tooltip-right"
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

          <button className="btn btn-sm btn-circle btn-error btn-outline">
            <TrashIcon className="icon-sm" />
          </button>
        </div>
      </Card.Footer>
    </Card>
  );
}

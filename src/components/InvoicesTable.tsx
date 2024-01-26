import { formatCurrency } from "@/utils/currency";
import { noSSR } from "@/utils/no-ssr";
import { inferQueryOutput, trpc } from "@/utils/trpc";
import Link from "next/link";
import {
  ArrowDownIcon,
  CheckIcon,
  DeleteIcon,
  SendIcon,
} from "@common/components/Icons";
import { addToast } from "@common/components/Toast";
import { Senstive } from "./Sensitive";
import { InvoiceIcon } from "./Icons";
import { openModal } from "@common/components/Modal";
import { getSendInvoiceModalId } from "./Modal/SendInvoiceModal";
import dynamic from "next/dynamic";
import { InvoiceStatus } from "@/utils/invoice";
import { getDeleteInvoiceModalId } from "./Modal/DeleteInvoiceModal";
import { UserUnlocked } from "./UserUnlocked";
import { dateToDistance } from "@/utils/date";

const SendInvoiceModal = dynamic(() => import("./Modal/SendInvoiceModal"));
const DeleteInvoiceModal = dynamic(() => import("./Modal/DeleteInvoiceModal"));

export const InvoicesTable = () => {
  const { data: invoices, isLoading } = trpc.useQuery(["invoice.recent"]);

  return (
    <>
      <h1 className="text-xl leading-normal font-extrabold flex gap-4 justify-between">
        Invoices
        <UserUnlocked>
          <Link href="/generate">
            <a className="btn btn-outline btn-sm">
              <InvoiceIcon /> generate
            </a>
          </Link>
        </UserUnlocked>
      </h1>

      <div className="border border-base-300 rounded-md mt-4 overflow-x-auto">
        <table className="table table-zebra w-full m-0">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>
                <div className="flex gap-3 items-center">
                  <span>Payer</span>/<span>Receiver</span>
                </div>
              </th>
              <th>Due Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>
                  <p className="mt-0">Loading invoices...</p>
                </td>
              </tr>
            ) : !invoices?.length ? (
              <tr>
                <td colSpan={7}>
                  <p className="mt-0">
                    You don&apos;t have any <b>invoices</b> yet.
                  </p>

                  <UserUnlocked>
                    <Link href="/generate">
                      <a className="btn btn-sm">
                        <InvoiceIcon />
                        Generate your first invoice
                      </a>
                    </Link>
                  </UserUnlocked>
                </td>
              </tr>
            ) : null}

            {invoices?.map((invoice) => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const STATUS_CLASS: Record<InvoiceStatus, string> = {
  created: "",
  sent: "badge-info",
  overdue: "badge-error",
  fullfilled: "badge-primary",
};

const InvoiceRow = ({
  invoice,
}: {
  invoice: inferQueryOutput<"invoice.recent">[number];
}) => {
  const utils = trpc.useContext();
  const fullfillInvoice = trpc.useMutation("invoice.fullfill", {
    onSuccess(data) {
      addToast(`Invoice ${data.number} marked as fullfilled`, "success");
      utils.invalidateQueries(["invoice.recent"]);
    },
  });

  const invoiceUrl = `/invoice/${invoice.id}`;

  return (
    <tr>
      <td className="font-normal align-top">
        <div className="flex flex-col">
          <Link href={invoiceUrl}>
            <a className="font-bold">{invoice.number}</a>
          </Link>
          <Senstive>
            <div className="font-bold">
              <Amount
                amount={invoice.amount}
                currency={invoice.payer.currency}
              />
            </div>
          </Senstive>
          <div className={`badge badge-sm ${STATUS_CLASS[invoice.status]}`}>
            {invoice.status}
          </div>
        </div>
      </td>
      <td>
        <div>{invoice.payer.alias ?? invoice.payer.name}</div>

        <div className="pl-4 text-xs">
          <ArrowDownIcon />
        </div>

        <div className="max-w-[200px] md:max-w-none text-ellipsis overflow-hidden">
          {invoice.receiver.alias ?? invoice.receiver.name}
        </div>
      </td>
      <td>{dateToDistance(invoice.expiredAt)}</td>
      <td>
        <div className="flex justify-end gap-1">
          <UserUnlocked>
            <div
              className="tooltip"
              data-tip={
                invoice.fullfilledAt ? "Already fullfilled" : "Send email"
              }
            >
              <button
                onClick={() => openModal(getSendInvoiceModalId(invoice.id))}
                className="btn-action"
                disabled={!!invoice.fullfilledAt}
              >
                <SendIcon />
              </button>
            </div>
            <div className="flex justify-end">
              <div
                className="tooltip"
                data-tip={
                  invoice.fullfilledAt
                    ? "Already fullfilled"
                    : "Mark as fullfilled"
                }
              >
                <button
                  onClick={() => fullfillInvoice.mutate(invoice.id)}
                  className="btn btn-action"
                  data-loading={fullfillInvoice.isLoading}
                  disabled={!!invoice.fullfilledAt}
                >
                  <CheckIcon />
                </button>
              </div>
            </div>
            <div className="tooltip tooltip-left" data-tip="Delete">
              <button
                onClick={() => openModal(getDeleteInvoiceModalId(invoice.id))}
                className="btn-action"
              >
                <DeleteIcon />
              </button>
            </div>
          </UserUnlocked>
        </div>
      </td>

      <SendInvoiceModal invoice={invoice} />
      <DeleteInvoiceModal invoice={invoice} />
    </tr>
  );
};

const Amount = noSSR<{
  amount: number;
  currency: string;
}>(({ amount, currency }) => <span>{formatCurrency(amount, currency)}</span>);

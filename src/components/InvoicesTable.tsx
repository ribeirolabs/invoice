import { formatCurrency } from "@/utils/currency";
import { noSSR } from "@/utils/no-ssr";
import { trpc } from "@/utils/trpc";
import { Company, Invoice } from "@prisma/client";
import Link from "next/link";
import { ArrowDownIcon, DeleteIcon } from "@common/components/Icons";
import { addToast } from "@common/components/Toast";
import { Senstive } from "./Sensitive";
import { InvoiceIcon } from "./Icons";

export const InvoicesTable = () => {
  const invoices = trpc.useQuery(["invoice.recent"]);

  return (
    <>
      <h1 className="text-xl leading-normal font-extrabold flex gap-4 justify-between">
        Invoices
        <Link href="/generate">
          <a className="btn btn-outline btn-sm gap-2">
            <InvoiceIcon /> generate
          </a>
        </Link>
      </h1>

      <div className="border border-base-300 rounded-md mt-4 overflow-x-auto">
        <table className="table table-zebra w-full m-0">
          <thead>
            <tr>
              <td className="w-[1ch]"></td>
              <th>Invoice</th>
              <th>
                <div className="flex gap-3 items-center">
                  <span>Payer</span>/<span>Receiver</span>
                </div>
              </th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {!invoices.data?.length && (
              <tr>
                <td colSpan={7}>
                  No invoices. <Link href="/generate">Generate</Link> your first
                  one.
                </td>
              </tr>
            )}

            {invoices.data?.map((invoice) => {
              return (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  onDelete={invoices.refetch}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const InvoiceRow = ({
  invoice,
  onDelete = () => void {},
}: {
  invoice: Invoice & {
    payer: Company;
    receiver: Company;
  };
  onDelete?: () => void;
}) => {
  const deleteInvoice = trpc.useMutation("invoice.delete", {
    onSuccess(data) {
      addToast(`Invoice ${data.number} deleted`, "success");

      onDelete();
    },
  });

  const invoiceUrl = `/invoice/${invoice.id}`;

  return (
    <tr className={deleteInvoice.isLoading ? "opacity-5" : ""}>
      <td colSpan={2} className="font-normal align-top">
        <div className="flex flex-col gap-2">
          <Link href={invoiceUrl}>
            <a className="font-black">{invoice.number}</a>
          </Link>
          <Senstive>
            <div className="badge badge-primary">
              <Amount
                amount={invoice.amount}
                currency={invoice.payer.currency}
              />
            </div>
          </Senstive>
        </div>
      </td>
      <td>
        <div>{invoice.payer.name}</div>

        <div className="pl-8 text-xs">
          <ArrowDownIcon />
        </div>

        <div className="max-w-[200px] md:max-w-none text-ellipsis overflow-hidden">
          {invoice.receiver.name}
        </div>
      </td>
      <td>{invoice.issuedAt.toLocaleDateString()}</td>
      <td>
        <div className="flex gap-1 justify-end">
          <button
            className="btn-action"
            onClick={() => deleteInvoice.mutateAsync(invoice.id)}
            disabled={deleteInvoice.isLoading}
          >
            <DeleteIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Amount = noSSR<{
  amount: number;
  currency: string;
}>(({ amount, currency }) => <span>{formatCurrency(amount, currency)}</span>);

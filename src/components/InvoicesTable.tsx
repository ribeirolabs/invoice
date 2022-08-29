import { formatCurrency } from "@/utils/currency";
import { noSSR } from "@/utils/no-ssr";
import { trpc } from "@/utils/trpc";
import { Company, Invoice } from "@prisma/client";
import Link from "next/link";
import { DeleteIcon, ViewDocumentIcon } from "./Icons";
import { addToast } from "./Toast";

export const InvoicesTable = () => {
  const invoices = trpc.useQuery(["invoice.recent"]);

  return (
    <>
      <h1 className="text-xl leading-normal font-extrabold flex gap-6">
        Recent Invoices
      </h1>

      <div className="border border-base-300 rounded-md mt-4 overflow-x-auto">
        <table className="table table-zebra w-full m-0">
          <thead>
            <tr>
              <th></th>
              <th>Number</th>
              <th>Amount</th>
              <th>Receiver</th>
              <th>Payer</th>
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
            {invoices.data?.map((invoice, i) => {
              return (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  index={i + 1}
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
  index,
  onDelete = () => void {},
}: {
  invoice: Invoice & {
    payer: Company;
    receiver: Company;
  };
  index: number;
  onDelete?: () => void;
}) => {
  const deleteInvoice = trpc.useMutation("invoice.delete", {
    onSuccess(data) {
      addToast(`Invoice ${data.number} deleted`, "success");

      onDelete();
    },
  });

  return (
    <tr className={deleteInvoice.isLoading ? "opacity-5" : ""}>
      <th>{index}</th>
      <td>{invoice.number}</td>
      <td>
        <Amount amount={invoice.amount} currency={invoice.payer.currency} />
      </td>
      <td>{invoice.receiver.name}</td>
      <td>{invoice.payer.name}</td>
      <td>{invoice.issuedAt.toLocaleDateString()}</td>
      <td>
        <div className="flex gap-1 justify-end">
          <Link href={`/invoice/${invoice.id}`}>
            <a className="btn-action" target="_blank" title="view">
              <ViewDocumentIcon />
            </a>
          </Link>
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

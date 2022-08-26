import { formatCurrency } from "@/utils/currency";
import { noSSR } from "@/utils/no-ssr";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { AddIcon, ViewDocumentIcon } from "./Icons";

export const InvoicesTable = () => {
  const invoices = trpc.useQuery(["invoice.recent"]);

  return (
    <>
      <h1 className="text-xl leading-normal font-extrabold flex gap-6">
        Invoices
        <Link href="/generate">
          <a className="btn btn-outline btn-sm">
            <AddIcon size={16} /> new
          </a>
        </Link>
      </h1>

      <div className="border border-base-300 rounded-md mt-4">
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
            {invoices.data?.map((invoice, i) => {
              return (
                <tr key={invoice.id}>
                  <th>{i + 1}</th>
                  <td>{invoice.number}</td>
                  <td>
                    <Amount
                      amount={invoice.amount}
                      currency={invoice.payer.currency}
                    />
                  </td>
                  <td>{invoice.receiver.name}</td>
                  <td>{invoice.payer.name}</td>
                  <td>{invoice.issuedAt.toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-1 justify-end">
                      <Link href={`/invoice/${invoice.id}`}>
                        <a
                          className="btn btn-sm btn-ghost btn-circle"
                          target="_blank"
                          title="view"
                        >
                          <ViewDocumentIcon size={18} />
                        </a>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const Amount = noSSR<{
  amount: number;
  currency: string;
}>(({ amount, currency }) => <span>{formatCurrency(amount, currency)}</span>);

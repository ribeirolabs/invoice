import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useMemo } from "react";
import { AddIcon, EditIcon, ShareIcon } from "./Icons";

export const CompaniesTable = () => {
  const session = trpc.useQuery(["auth.getSession"]);
  const companies = trpc.useQuery(["company.getAll"]);
  const invoiceCounts = trpc.useQuery(["company.getAllInvoiceCounts"]);

  function copyShareLink(companyId: string) {
    if (!session.data?.user) {
      return;
    }

    const base = `${window.location.protocol}//${window.location.host}`;
    const url = new URL("/api/share", base);

    url.searchParams.set("type", "company");
    url.searchParams.set("value", companyId);
    url.searchParams.set("sharedBy", session.data.user.id);

    navigator.clipboard
      .writeText(url.toString())
      .then(() => alert("Link copied"));
  }

  const countByInvoice = useMemo(() => {
    const counts: Record<"payer" | "receiver", Record<string, number>> = {
      payer: {},
      receiver: {},
    };

    for (const item of invoiceCounts.data ?? []) {
      const count = Number(item.count);

      if (item.payerId) {
        counts.payer[item.payerId] = count;
      }

      if (item.receiverId) {
        counts.receiver[item.receiverId] = count;
      }
    }

    return counts;
  }, [invoiceCounts.data]);

  return (
    <>
      <h1 className="text-xl leading-normal font-extrabold flex gap-6">
        Companies
        <Link href="/company/new">
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
              <th>Name</th>
              <th>Receiver Invoices</th>
              <th>Payer Invoices</th>
              <th>Owner</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.data?.map((company, i) => {
              const isOwned = Boolean(
                company.users.find(
                  (user) => user.userId === session.data?.user?.id && user.owner
                )
              );

              return (
                <tr key={company.id}>
                  <th>{i + 1}</th>
                  <td>{company.name}</td>
                  <td>{countByInvoice.receiver?.[company.id] ?? 0}</td>
                  <td>{countByInvoice.payer?.[company.id] ?? 0}</td>
                  <td>
                    <div className="input-group">
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={isOwned}
                        readOnly
                      />
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1 justify-end">
                      <Link href={`/company/${company.id}`}>
                        <a
                          className="btn btn-sm btn-ghost btn-circle"
                          title="Edit"
                        >
                          <EditIcon size={18} />
                        </a>
                      </Link>
                      <button
                        className="btn btn-sm btn-ghost btn-circle"
                        onClick={() => copyShareLink(company.id)}
                        title="Share"
                      >
                        <ShareIcon size={18} />
                      </button>
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

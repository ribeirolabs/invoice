import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useMemo } from "react";
import { AddIcon, EditIcon, ShareIcon } from "./Icons";
import { addToast } from "./Toast";

export const CompaniesTable = () => {
  const session = trpc.useQuery(["auth.getSession"]);
  const companies = trpc.useQuery(["company.getAll"]);
  const invoiceCounts = trpc.useQuery(["invoice.countByCompany"]);

  const authUser = session.data?.user;

  function copyShareLink(companyId: string) {
    if (!authUser) {
      return;
    }

    const base = `${window.location.protocol}//${window.location.host}`;
    const url = new URL("/api/share", base);

    url.searchParams.set("type", "company");
    url.searchParams.set("value", companyId);
    url.searchParams.set("sharedBy", authUser.id);

    navigator.clipboard
      .writeText(url.toString())
      .then(() => addToast("Link copied to clipboard", "info"));
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
          <a className="btn btn-outline btn-sm gap-2">
            <AddIcon /> new
          </a>
        </Link>
      </h1>

      <div className="border border-base-300 rounded-md mt-4 overflow-x-auto">
        <table className="table table-zebra w-full m-0">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>As Receiver</th>
              <th>As Payer</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.data?.map((company, i) => {
              const isOwned = company.users.some(
                (user) => user.userId === authUser?.id && user.owner
              );

              const isShared = company.users.some(
                (user) => user.type === "SHARED"
              );

              return (
                <tr key={company.id}>
                  <th>{i + 1}</th>
                  <td>
                    {company.name}
                    {isShared && (
                      <span className="badge badge-secondary badge-sm ml-2">
                        shared
                      </span>
                    )}
                    {isOwned && (
                      <span className="badge badge-primary badge-sm ml-2">
                        onwed
                      </span>
                    )}
                  </td>
                  <td>{countByInvoice.receiver?.[company.id] ?? 0}</td>
                  <td>{countByInvoice.payer?.[company.id] ?? 0}</td>
                  <td>
                    <div className="flex gap-1 justify-end">
                      <Link href={`/company/${company.id}`}>
                        <a className="btn-action" title="Edit">
                          <EditIcon />
                        </a>
                      </Link>
                      <button
                        className="btn-action"
                        onClick={() => copyShareLink(company.id)}
                        title="Share"
                      >
                        <ShareIcon />
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

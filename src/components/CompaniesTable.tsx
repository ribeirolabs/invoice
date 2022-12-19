import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useMemo } from "react";
import { AddIcon, ShareIcon } from "@common/components/Icons";
import { Company } from "@prisma/client";
import { shareOrCopy } from "@common/utils/share";

export const CompaniesTable = () => {
  const session = trpc.useQuery(["auth.getSession"]);
  const companies = trpc.useQuery(["company.getAll"]);
  const invoiceCounts = trpc.useQuery(["invoice.countByCompany"]);

  const authUser = session.data?.user;

  function copyShareLink(company: Company) {
    if (!authUser) {
      return;
    }

    const base = `${window.location.protocol}//${window.location.host}`;
    const url = new URL("/api/share", base);

    url.searchParams.set("type", "company");
    url.searchParams.set("value", company.id);
    url.searchParams.set("sharedBy", authUser.id);

    const data: Required<Pick<ShareData, "url" | "text">> = {
      url: url.toString(),
      text: `Sharing ${company.name}`,
    };

    shareOrCopy(data);
  }

  const reportByInvoice = useMemo(() => {
    const report: Record<
      "payer" | "receiver",
      Record<
        string,
        {
          count: number;
          amount: number;
        }
      >
    > = {
      payer: {},
      receiver: {},
    };

    for (const item of invoiceCounts.data ?? []) {
      const count = Number(item.count);
      const amount = Number(item.amount);

      if (item.payerId) {
        report.payer[item.payerId] = {
          count,
          amount,
        };
      }

      if (item.receiverId) {
        report.receiver[item.receiverId] = {
          count,
          amount,
        };
      }
    }

    return report;
  }, [invoiceCounts.data]);

  return (
    <>
      <h1 className="text-xl leading-normal font-extrabold flex gap-4 justify-between">
        Companies
        <Link href="/company/new">
          <a className="btn btn-outline btn-sm">
            <AddIcon size={16} /> add
          </a>
        </Link>
      </h1>

      <div className="border border-base-300 rounded-md mt-4 overflow-x-auto">
        <table className="table table-zebra w-full m-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Invoices</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.data?.map((company) => {
              const isOwned = company.users.some(
                (user) => user.userId === authUser?.id && user.owner
              );

              const isShared = company.users.some(
                (user) => user.type === "SHARED"
              );

              const companyUrl = `/company/${company.id}`;

              const asReceiver = reportByInvoice.receiver?.[company.id];
              const asPayer = reportByInvoice.payer?.[company.id];

              const countReceived = asReceiver?.count ?? 0;
              const countPaid = asPayer?.count ?? 0;

              return (
                <tr key={company.id}>
                  <td>
                    <div className="align-middle max-w-[300px] md:max-w-none text-ellipsis overflow-hidden">
                      <Link href={companyUrl}>
                        <a className="font-bold">{company.name}</a>
                      </Link>
                    </div>

                    {isOwned && (
                      <span className="badge badge-info badge-sm">owned</span>
                    )}

                    {isShared && (
                      <span className="badge badge-secondary badge-sm">
                        shared
                      </span>
                    )}
                  </td>

                  <td>
                    {countReceived > 0 && `${countReceived} received`}
                    {countPaid > 0 && `${countPaid} paid`}
                  </td>

                  <td>
                    <div className="flex gap-1 justify-end">
                      <button
                        className="btn-action"
                        onClick={() => copyShareLink(company)}
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

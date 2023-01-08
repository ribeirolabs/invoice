import { CompaniesTable } from "@/components/CompaniesTable";
import { InvoicesTable } from "@/components/InvoicesTable";
import { getUserDisplayName } from "@/utils/account";
import { trpc } from "@/utils/trpc";
import { InfoIcon } from "@common/components/Icons";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { ssp } from "@common/server/ssp";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return [
      ssr.fetchQuery("company.getAll"),
      ssr.fetchQuery("invoice.countByCompany"),
      ssr.fetchQuery("invoice.recent"),
      ssr.fetchQuery("user.account.transfers.getPending"),
    ];
  });
};

const Home: NextPage = () => {
  return (
    <ProtectedPage>
      <PendingAccountTransfers />
      <InvoicesTable />
      <div className="divider my-6"></div>
      <CompaniesTable />
    </ProtectedPage>
  );
};

function PendingAccountTransfers() {
  const pending = trpc.useQuery(["user.account.transfers.getPending"]);

  if (!pending.data || !pending.data.length) {
    return null;
  }

  return (
    <div className="not-prose mb-4">
      {pending.data.map((request) => (
        <div
          key={request.id}
          className="alert bg-warning/10 items-stretch md:items-center"
        >
          <span className="flex-col md:flex-row">
            <div className="text-center">
              Pending transfer account request{" "}
              {request.isOwner ? "to " : "from "}
              <span className="text-highlight break-words whitespace whitespace-normal">
                {request.isOwner
                  ? getUserDisplayName(request.toUserEmail, request.toUser)
                  : getUserDisplayName(request.fromUserEmail, request.fromUser)}
              </span>
            </div>
          </span>
          <Link href={`/settings/transfer-account/${request.id}`}>
            <a className="flex-1 md:flex-none btn btn-sm btn-warning md:btn-wide btn-bordered">
              View
            </a>
          </Link>
        </div>
      ))}

      <div className="divider"></div>
    </div>
  );
}

export default Home;

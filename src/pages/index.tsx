import { CompaniesTable } from "@/components/CompaniesTable";
import { InvoicesTable } from "@/components/InvoicesTable";
import { getUserDisplayName } from "@/utils/account";
import { trpc } from "@/utils/trpc";
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
      ssr.fetchQuery("user.account.transfer.getPending"),
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
  const { data: pending } = trpc.useQuery(["user.account.transfer.getPending"]);

  if (!pending) {
    return null;
  }

  return (
    <div className="not-prose mb-4">
      <div key={pending.id} className="alert bg-warning/10">
        <span className="flex-col md:flex-row">
          <div className="text-center">
            Pending transfer account request {pending.isOwner ? "to " : "from "}
            <span className="text-highlight break-words whitespace whitespace-normal">
              {pending.isOwner
                ? getUserDisplayName(pending.toUserEmail, pending.toUser)
                : getUserDisplayName(pending.fromUserEmail, pending.fromUser)}
            </span>
          </div>
        </span>
        <Link href={`/settings/transfer-account/${pending.id}`}>
          <a className="flex-1 md:flex-none btn btn-sm btn-warning md:btn-wide btn-bordered">
            View
          </a>
        </Link>
      </div>

      <div className="divider"></div>
    </div>
  );
}

export default Home;

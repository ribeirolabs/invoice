import { CompaniesTable } from "@/components/CompaniesTable";
import { InvoicesTable } from "@/components/InvoicesTable";
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
        <div key={request.id} className="alert bg-info/10">
          <span>
            <span className="text-info">
              <InfoIcon size={24} />
            </span>
            Pensing transfer account request from{" "}
            <span className="text-highlight">
              {request.fromUser
                ? `${request.fromUser.name} (${request.fromUser.email})`
                : request.fromUserEmail}
            </span>
          </span>
          <Link href={`/settings/transfer-account/${request.id}`}>
            <a className="btn btn-sm btn-info btn-bordered">View</a>
          </Link>
        </div>
      ))}

      <div className="divider"></div>
    </div>
  );
}

export default Home;

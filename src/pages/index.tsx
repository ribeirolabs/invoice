import { CompaniesTable } from "@/components/CompaniesTable";
import { InvoicesTable } from "@/components/InvoicesTable";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@/server/ssp";
import type { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return [
      ssr.prefetchQuery("company.getAll"),
      ssr.prefetchQuery("invoice.countByCompany"),
      ssr.prefetchQuery("invoice.recent"),
    ];
  });
};

const Home: NextPage = () => {
  return (
    <ProtectedPage>
      <div className="w-content">
        <InvoicesTable />
        <div className="divider my-6"></div>
        <CompaniesTable />
      </div>
    </ProtectedPage>
  );
};

export default Home;

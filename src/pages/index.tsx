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
      <InvoicesTable />
      <div className="my-12"></div>
      <CompaniesTable />
    </ProtectedPage>
  );
};

export default Home;

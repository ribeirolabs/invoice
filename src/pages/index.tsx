import { CompaniesTable } from "@/components/CompaniesTable";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@/server/ssp";
import type { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.fetchQuery("company.getAll");
  });
};

const Home: NextPage = () => {
  return (
    <ProtectedPage>
      <CompaniesTable />
    </ProtectedPage>
  );
};

export default Home;

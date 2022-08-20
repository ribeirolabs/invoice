import { Header } from "@/components/Header";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@/server/ssp";
import type { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, () => {
    return Promise.resolve();
  });
};

const Home: NextPage = () => {
  return (
    <ProtectedPage>
      <Header />
      <main className="p-4">
        <h1 className="text-xl leading-normal font-extrabold">Invoices</h1>
      </main>
    </ProtectedPage>
  );
};

export default Home;

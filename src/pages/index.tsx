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
      <main className="dark container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold">
          Invoice : <span className="text-primary">RibeiroLabs</span>
        </h1>
      </main>
    </ProtectedPage>
  );
};

export default Home;

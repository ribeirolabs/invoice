import { Header } from "@/components/Header";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@/server/ssp";
import { trpc } from "@/utils/trpc";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.fetchQuery("company.getAll");
  });
};

const Home: NextPage = () => {
  return (
    <ProtectedPage>
      <Header />
      <main className="p-4">
        <Companies />
      </main>
    </ProtectedPage>
  );
};

const Companies = () => {
  const companies = trpc.useQuery(["company.getAll"]);

  return (
    <>
      <h1 className="text-xl leading-normal font-extrabold">Companies</h1>
      <ul>
        {companies.data?.map((company) => (
          <li key={company.id}>
            <Link href={`/company/${company.id}`}>{company.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;

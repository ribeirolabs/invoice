import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Invoice / RibeiroLabs</title>
        <meta name="description" content="Generate Invoices" />
      </Head>

      <main className="dark container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold">
          Invoice : <span className="text-primary">RibeiroLabs</span>
        </h1>
        <p className="text-2xl ">Coming soon.</p>
      </main>
    </>
  );
};

export default Home;

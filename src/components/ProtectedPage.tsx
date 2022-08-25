import { trpc } from "@/utils/trpc";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect } from "react";
import { Header } from "./Header";

const ProtectedContext = createContext<Session | null>(null);

export const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const session = trpc.useQuery(["auth.getSession"]);
  const router = useRouter();

  useEffect(() => {
    if (session.data == null && session.status === "success") {
      router.push("/api/auth/signin");
    }
  }, [session, router]);

  if (session.data == null) {
    return <p>Loading...</p>;
  }

  return (
    <ProtectedContext.Provider value={session.data}>
      <Header />
      <main className="p-4">{children}</main>
    </ProtectedContext.Provider>
  );
};

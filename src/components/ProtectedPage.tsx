import { trpc } from "@/utils/trpc";
import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect } from "react";
import { AppHeader } from "@common/components/Header";

const ProtectedContext = createContext<Session | null>(null);

export const ProtectedPage = ({ children }: { children: ReactNode }) => {
  const session = trpc.useQuery(["auth.getSession"]);
  const router = useRouter();

  useEffect(() => {
    if (session.data == null && session.status === "success") {
      const callbackUrl = encodeURIComponent(
        window.location.pathname + window.location.search
      );

      router.push("/auth/signin?callbackUrl=" + callbackUrl);
    }
  }, [session, router]);

  if (session.data == null) {
    return null;
  }

  return (
    <ProtectedContext.Provider value={session.data}>
      <AppHeader appName="invoice">
        <Link href="/generate">
          <a className="btn btn-sm btn-primary btn-outline">Generate</a>
        </Link>
      </AppHeader>
      <main className="p-4">{children}</main>
    </ProtectedContext.Provider>
  );
};

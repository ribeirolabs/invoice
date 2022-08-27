import { trpc } from "@/utils/trpc";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";
import { ChevronDownIcon } from "./Icons";

export function Header() {
  const session = trpc.useQuery(["auth.getSession"]);

  const user = session.data?.user;

  const initials = useMemo(() => {
    if (!user) {
      return "";
    }

    const parts = user.name?.split(" ") ?? [];

    return [parts[0]?.[0] ?? "", parts.at(-1)?.[0] ?? ""].join("");
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <header className="not-prose navbar bg-base-300 sticky top-0 z-50">
      <div className="w-content flex justify-between ">
        <div className="items-baseline text-secondary">
          <span className="hidden lg:inline-block">ribeirolabs</span>
          <span className="lg:hidden">r</span>
          <span className="mx-1">/</span>
          <Link href="/">
            <a className="text-primary font-bold normal-case"> invoice</a>
          </Link>
        </div>

        <div>
          <Link href="/generate">
            <a className="btn btn-sm btn-primary btn-outline">Generate</a>
          </Link>
        </div>

        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost gap-2 btn-sm">
              <span className="hidden lg:inline-block">{user.name}</span>
              <span className="lg:hidden">{initials}</span>
              <ChevronDownIcon />
            </button>

            <ul
              tabIndex={0}
              className="w-content mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52"
            >
              <li>
                <button onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

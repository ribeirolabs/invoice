import { trpc } from "@/utils/trpc";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ChevronDownIcon } from "./Icons";

export function Header() {
  const { data } = trpc.useQuery(["auth.getSession"]);

  if (!data?.user) {
    return null;
  }

  return (
    <header className="not-prose navbar bg-base-300 justify-between sticky top-0 z-50">
      <div className="items-baseline text-secondary">
        <span>ribeirolabs</span>
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
          <button tabIndex={0} className="btn btn-ghost gap-2">
            {data.user.name}
            <ChevronDownIcon />
          </button>

          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52"
          >
            <li>
              <button onClick={() => signOut({ callbackUrl: "/" })}>
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

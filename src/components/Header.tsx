import { useSession } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const { data } = useSession();

  if (data?.user == null) {
    return null;
  }

  return (
    <header className="not-prose navbar bg-base-200">
      <div className="flex-1 items-baseline text-secondary">
        <Link href="https://ribeiro.app">
          <a>ribeirolabs</a>
        </Link>
        <span className="mx-1">/</span>
        <Link href="/">
          <a className="text-primary font-bold normal-case"> invoice</a>
        </Link>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <button tabIndex={0} className="btn btn-ghost">
            <a>{data.user.name}</a>
          </button>

          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52"
          >
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <Link href="/api/auth/signout">Sign out</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

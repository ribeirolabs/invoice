import { useSession } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const { data } = useSession();

  if (data?.user == null) {
    return null;
  }

  return (
    <header className="navbar bg-base-200">
      <div className="flex-1">
        <Link href="/">
          <a className="btn btn-link normal-case text-xl">Invoice</a>
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

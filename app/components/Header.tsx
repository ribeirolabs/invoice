import { User } from "@prisma/client";
import { LogoutIcon, PlusIcon, UserCircleIcon } from "./Icons";
import { Logo } from "./Logo";

export function Header({ user }: { user: User }) {
  return (
    <header className="print:hidden -navbar bg-neutral-900 -backdrop-blur-md sticky top-0 z-30">
      <div className="max-content flex-1 navbar">
        <div className="flex-1">
          <Logo />
        </div>

        <div className="max-sm:drawer max-sm:!w-auto drawer-end sm:dropdown sm:dropdown-end">
          <input
            id="setting-drawer"
            type="checkbox"
            className="drawer-toggle"
          />

          <label
            htmlFor="setting-drawer"
            className="btn btn-circle bg-transparent border-transparent avatar max-sm:drawer-button"
          >
            <div className="rounded-full">
              <UserCircleIcon className="icon-xl" />
            </div>
          </label>

          <div className="max-sm:drawer-side dropdown-content z-40">
            <label
              htmlFor="setting-drawer"
              aria-label="close sidebar"
              className="drawer-overlay -backdrop-blur-sm"
            />
            <ul
              tabIndex={0}
              className="sm:mt-1 p-2 shadow bg-base-200 sm:rounded w-56 overflow-hidden max-sm:min-h-full z-40"
            >
              <li className="p-2 flex flex-col overflow-hidden">
                <span className="font-bold">{user.name}</span>
                <span className="text-dim text-sm leading-none text-ellipsis overflow-hidden">
                  {user.email}
                </span>
              </li>

              <li>
                <div className="divider m-0" />
              </li>

              <li className="">
                <a
                  href="/logout"
                  className="flex gap-2 hover:bg-neutral-800 rounded p-2"
                >
                  <LogoutIcon />
                  <span>Sair</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-[100%] -translate-y-[50%] border-4 border-neutral-900 rounded-full">
        <a
          href="/genearate"
          className="btn btn-primary group gap-0 transition-all btn-md"
        >
          <PlusIcon />
          <span className="w-0 group-hover:w-[11ch] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all text-end">
            Gerar Invoice
          </span>
        </a>
      </div>
    </header>
  );
}

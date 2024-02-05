import { User } from "@prisma/client";
import {
  ChevronDownIcon,
  CompaniesIcon,
  CompaniesOutlineIcon,
  DocumentPlusIcon,
  LogoutIcon,
  UserCircleIcon,
} from "./Icons";
import { Logo } from "./Logo";
import { ReactNode } from "react";
import { Portal } from "./Portal";

export function Header({ user }: { user: User }) {
  return (
    <header className="print:hidden sticky w-full top-0 z-30 bg-neutral-900">
      <div className="max-content flex-1 navbar py-0 relative">
        <div className="flex-1">
          <Logo />
        </div>

        <div className="max-sm:drawer max-sm:w-fit drawer-end sm:dropdown sm:dropdown-end">
          <input
            id="setting-drawer"
            type="checkbox"
            className="drawer-toggle"
          />

          <label
            htmlFor="setting-drawer"
            className="btn gap-0 px-1.5 bg-base-100 hover:bg-neutral-700 border-transparent avatar max-sm:drawer-button"
          >
            <UserCircleIcon className="icon-xl" />
            <ChevronDownIcon />
          </label>

          <div className="max-sm:drawer-side overflow-x-hidden dropdown-content z-40">
            <label
              htmlFor="setting-drawer"
              aria-label="close sidebar"
              className="drawer-overlay -backdrop-blur-sm"
            />
            <ul
              tabIndex={0}
              className="header-actions p-2 shadow bg-base-200 sm:rounded w-56 overflow-hidden max-sm:min-h-full z-40 border border-neutral-900"
            >
              <li className="flex py-2 gap-2 overflow-hidden items-center">
                <div className="w-8 aspect-square rounded-full bg-neutral-700 overflow-hidden">
                  {user.image && <img src={user.image} />}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold leading-none">{user.name}</div>
                  <div className="text-dim text-sm text-ellipsis overflow-hidden">
                    {user.email}
                  </div>
                </div>
              </li>

              <li>
                <div className="divider m-0" />
              </li>

              <li>
                <a
                  href="/companies"
                  className="flex gap-2 hover:bg-neutral-800 rounded p-2 font-medium"
                >
                  <CompaniesIcon />
                  <span>Empresas</span>
                </a>
              </li>

              <li>
                <a
                  href="/logout"
                  className="flex gap-2 hover:bg-neutral-800 rounded p-2 font-medium"
                >
                  <LogoutIcon />
                  <span>Sair</span>
                </a>
              </li>

              <div id="sidebar-actions" />
            </ul>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-[100%] -translate-y-[50%] rounded-full bg-neutral-800">
          <a
            href="/generate"
            className="btn btn-primary group md:gap-2 transition-all border-4 !border-neutral-900"
          >
            <DocumentPlusIcon />
            <span className="hidden md:block whitespace-nowrap transition-all text-end">
              Invoice
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}

export function Actions({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <Portal selector="#sidebar-actions">
      <li>
        <div className="divider m-0" />
      </li>
      <li className="menu-title">{title}</li>
      {children}
    </Portal>
  );
}

Header.Actions = Actions;

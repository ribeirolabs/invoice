import { User } from "@prisma/client";
import {
  CancelIcon,
  CompaniesIcon,
  DocumentPlusIcon,
  HamburgerIcon,
  LogoutIcon,
} from "./Icons";
import { Logo } from "./Logo";
import { ReactNode } from "react";
import { Portal } from "./Portal";

export function Header({ user }: { user: User }) {
  return (
    <header className="print:hidden sticky w-full top-0 z-30 bg-neutral-900">
      <div className="max-content flex-1 navbar !p-0 relative">
        <div className="flex-1 px-1">
          <Logo />
        </div>

        <div className="max-sm:drawer max-sm:w-fit drawer-end sm:dropdown sm:dropdown-end">
          <input id="menu-drawer" type="checkbox" className="drawer-toggle" />

          <label
            htmlFor="menu-drawer"
            className="btn gap-0 btn-circle btn-ghost max-sm:drawer-button"
          >
            <HamburgerIcon />
          </label>

          <div className="max-sm:drawer-side overflow-x-hidden dropdown-content z-40">
            <label
              htmlFor="menu-drawer"
              aria-label="close sidebar"
              className="drawer-overlay -backdrop-blur-sm"
            />
            <ul
              tabIndex={0}
              className="header-actions sm:py-2 shadow bg-base-200 sm:rounded w-56 overflow-hidden max-sm:min-h-full z-40 border border-neutral-900"
            >
              <li className="flex flex-col p-2 gap-2 overflow-hidden items-center">
                <div className="w-16 aspect-square rounded-full bg-neutral-700 overflow-hidden">
                  {user.image && (
                    <img src={user.image} referrerPolicy="no-referrer" />
                  )}
                </div>

                <div className="overflow-hidden text-center w-full">
                  <div className="font-bold leading-none">{user.name}</div>
                  <div className="text-dim text-sm text-ellipsis overflow-hidden">
                    {user.email}
                  </div>
                  <a
                    href="/logout"
                    className="btn btn-sm btn-neutral w-full btn-outline"
                  >
                    <LogoutIcon className="icon-sm" />
                    Sair
                  </a>
                </div>

                <label
                  htmlFor="menu-drawer"
                  aria-label="close sidebar"
                  className="sm:hidden btn btn-circle btn-ghost absolute right-1 top-1"
                >
                  <CancelIcon />
                </label>
              </li>

              <li>
                <div className="divider" />
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

              <div id="menu-actions" />
            </ul>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 top-[100%] -translate-y-[50%] rounded-full bg-neutral-800">
          <a
            href="/generate"
            className="btn btn-primary group md:gap-2 transition-all border-4 !border-neutral-900 rounded-full"
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
    <Portal selector="#menu-actions">
      <li>
        <div className="divider m-0" />
      </li>
      <li className="menu-title">{title}</li>
      {children}
    </Portal>
  );
}

Header.Actions = Actions;

import { User } from "@prisma/client";
import { LogoutIcon } from "./Icons";
import { Logo } from "./Logo";

export function Header({ user }: { user: User }) {
  return (
    <header className="bg-neutral-900 print:hidden">
      <div className="p-4 flex items-center justify-between max-content">
        <Logo />

        <div className="flex items-center justify-center gap-2">
          <div className="text-end">
            <p>{user.name}</p>
            <p className="text-dim text-xs">{user.email}</p>
          </div>
          <a href="/logout" className="btn btn-sm btn-outline btn-neutral">
            <LogoutIcon className="icon-xs" />
            <span className="hidden sm:block">Sair</span>
          </a>
        </div>
      </div>
    </header>
  );
}

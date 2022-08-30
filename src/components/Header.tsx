import { AppHeader } from "@common/components/Header";
import Link from "next/link";

export const Header = () => {
  return (
    <AppHeader appName="invoice">
      <Link href="/generate">
        <a className="btn btn-sm btn-primary btn-outline">Generate</a>
      </Link>
    </AppHeader>
  );
};

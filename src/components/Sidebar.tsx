import { AppSidebar, closeSidebar } from "@common/components/AppSidebar";
import { EyeClosedIcon, EyeIcon } from "@common/components/Icons";
import { useSettings } from "@common/components/Settings";
import Link from "next/link";
import { InvoiceIcon } from "./Icons";

export const Sidebar = () => {
  const [sensitiveInformation, update] = useSettings("sensitiveInformation");

  return (
    <AppSidebar>
      <li>
        <button
          onClick={() => {
            update((current) => !current);
            closeSidebar();
          }}
        >
          {sensitiveInformation ? <EyeIcon /> : <EyeClosedIcon />}
          Sensitive Information
        </button>
      </li>
      <li>
        <Link href="/generate">
          <a className="">
            <InvoiceIcon />
            Generate Invoice
          </a>
        </Link>
      </li>
    </AppSidebar>
  );
};

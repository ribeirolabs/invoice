import { AppSidebar, closeSidebar } from "@common/components/AppSidebar";
import { EyeClosedIcon, EyeIcon } from "@common/components/Icons";
import { useSettings } from "@common/components/Settings";
import Link from "next/link";
import { InvoiceIcon } from "./Icons";

export const Sidebar = () => {
  const [sensitiveInformation, update] = useSettings("sensitiveInformation");

  return (
    <AppSidebar>
      <li className={sensitiveInformation ? "" : "bg-base-300"}>
        <label>
          <span className="swap swap-rotate">
            <input
              type="checkbox"
              checked={sensitiveInformation}
              onChange={(e) => {
                update(e.target.checked);
                closeSidebar();
              }}
            />
            <span className="swap-on">
              <EyeIcon />
            </span>
            <span className="swap-off">
              <EyeClosedIcon />
            </span>
          </span>
          Sensitive Information
        </label>
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

import { AppSidebar, closeSidebar } from "@common/components/AppSidebar";
import { DownloadIcon, EyeClosedIcon, EyeIcon } from "@common/components/Icons";
import { useSettings } from "@common/components/Settings";
import { dispatchCustomEvent } from "@ribeirolabs/events";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { InvoiceIcon } from "./Icons";

export const Sidebar = () => {
  const [sensitiveInformation, update] = useSettings("sensitiveInformation");
  const { route } = useRouter();
  const showPrint = route === "/invoice/[id]";
  const [exporting, setExporting] = useState(false);

  function onExport() {
    setExporting(true);
    dispatchCustomEvent("export-invoice", {
      onDone: () => setExporting(false),
    });
  }

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
          <a>
            <InvoiceIcon />
            Generate Invoice
          </a>
        </Link>
      </li>
      {showPrint && (
        <li>
          <button onClick={onExport} disabled={exporting}>
            {exporting ? (
              <div
                className="btn btn-ghost btn-only-loader w-[1em] h-[1em] min-h-[1em] p-0"
                data-loading={true}
              ></div>
            ) : (
              <DownloadIcon />
            )}
            Export Invoice
          </button>
        </li>
      )}
    </AppSidebar>
  );
};

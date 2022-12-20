import { AppSidebar, closeSidebar } from "@common/components/AppSidebar";
import {
  DownloadIcon,
  EyeClosedIcon,
  EyeIcon,
  SendIcon,
} from "@common/components/Icons";
import { useSettings } from "@common/components/Settings";
import { dispatchCustomEvent } from "@ribeirolabs/events";
import Link from "next/link";
import { useRouter } from "next/router";
import { useReducer } from "react";
import { InvoiceIcon } from "./Icons";

function loadingReducer<Key extends string>(
  state: Record<Key, boolean>,
  [action, key]: ["start" | "finish", Key]
) {
  return {
    ...state,
    [key]: action === "start",
  };
}

export const Sidebar = () => {
  const [sensitiveInformation, update] = useSettings("sensitiveInformation");
  const { route } = useRouter();
  const atInvoicePage = route === "/invoice/[id]";
  const [{ sending, exporting }, loading] = useReducer(
    loadingReducer<"exporting" | "sending">,
    {
      exporting: false,
      sending: false,
    }
  );

  function onExport() {
    loading(["start", "exporting"]);
    dispatchCustomEvent("export-invoice", {
      onDone: () => loading(["finish", "exporting"]),
    });
  }

  function onSendEmail() {
    loading(["start", "sending"]);
    dispatchCustomEvent("send-invoice", {
      onDone: () => loading(["finish", "sending"]),
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
      {atInvoicePage && (
        <>
          <li>
            <button onClick={onExport} disabled={exporting}>
              {exporting ? (
                <div
                  className="btn btn-ghost btn-only-loader w-[1em] h-[1em] min-h-[1em] p-0"
                  data-loading
                ></div>
              ) : (
                <DownloadIcon />
              )}
              Export Invoice
            </button>
          </li>
          <li>
            <button onClick={onSendEmail} disabled={sending}>
              {sending ? (
                <div
                  className="btn btn-ghost btn-only-loader w-[1em] h-[1em] min-h-[1em] p-0"
                  data-loading
                ></div>
              ) : (
                <SendIcon />
              )}
              Send Invoice
            </button>
          </li>
        </>
      )}
    </AppSidebar>
  );
};

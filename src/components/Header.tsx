import { AppHeader } from "@common/components/Header";
import {
  EyeClosedIcon,
  EyeIcon,
  CreateDocumentIcon,
} from "@common/components/Icons";
import { InvoiceIcon } from "./Icons";
import { useSettings } from "@common/components/Settings";
import Link from "next/link";

export const Header = () => {
  const [sensitiveInformation, update] = useSettings("sensitiveInformation");

  return (
    <AppHeader>
      <div className="flex items-center justify-between gap-2">
        <div></div>
        <Link href="/generate">
          <a className="btn btn-md btn-circle btn-primary btn-outline">
            <InvoiceIcon size={26} />
          </a>
        </Link>

        <button
          className={`btn btn-md btn-circle ${
            sensitiveInformation ? "btn-ghost" : ""
          }`}
          onClick={() => {
            update((current) => !current);
          }}
        >
          {sensitiveInformation ? <EyeIcon /> : <EyeClosedIcon />}
        </button>
      </div>
    </AppHeader>
  );
};

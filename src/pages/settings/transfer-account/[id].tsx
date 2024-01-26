import { AcceptTransferAccount } from "@/components/Modal/AcceptTransferAccount";
import { CancelTransferAccount } from "@/components/Modal/CancelTransferAccount";
import { RejectTransferAccount } from "@/components/Modal/RejectTransferAccount";
import { getUserDisplayName } from "@/utils/account";
import { dateToDistance } from "@/utils/date";
import { trpc } from "@/utils/trpc";
import { CheckIcon, CloseIcon } from "@common/components/Icons";
import { openModal } from "@common/components/Modal";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { ssp } from "@common/server/ssp";
import { cn } from "@common/utils/classNames";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, () => []);
};

export default function SettingsPage() {
  return (
    <ProtectedPage>
      <Page />
    </ProtectedPage>
  );
}

function Page() {
  const router = useRouter();
  const { data: transfer } = trpc.useQuery([
    "user.account.transfer.get",
    { id: router.query.id as string },
  ]);

  if (!transfer) {
    return <p>Transfer not found</p>;
  }

  return (
    <div>
      <header className="grid gap-2">
        <div className="flex justify-between md:justify-start items-center gap-6">
          <h2 className="m-0">Transfer Request</h2>
          <span
            className={cn(
              "badge rounded-full px-2 py-3 gap-2",
              transfer.status === "pending" && "text-info",
              transfer.status === "accepted" && "text-primary",
              transfer.status === "rejected" && "text-error",
              transfer.status === "cancelled" && "text-error"
            )}
          >
            <span className="flex h-2 w-2 items-center justify-center relative">
              {transfer.status === "pending" && (
                <span className="animate-ping-slow absolute rounded-full w-3 h-3 bg-info" />
              )}

              <span
                className={cn(
                  "relative rounded-full w-2 h-2",
                  transfer.status === "pending" && "bg-info",
                  transfer.status === "accepted" && "bg-primary",
                  transfer.status === "rejected" && "bg-error",
                  transfer.status === "cancelled" && "bg-error"
                )}
              />
            </span>
            {transfer.status}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm">
            {transfer.isOwner ? "To" : "From"}{" "}
            <span className="text-highlight">
              {transfer.isOwner
                ? getUserDisplayName(transfer.toUserEmail, transfer.toUser)
                : getUserDisplayName(transfer.fromUserEmail, transfer.fromUser)}
            </span>
          </span>
        </div>

        {transfer.status === "pending" && (
          <div className="flex gap-2">
            {transfer.isOwner ? (
              <button
                className="flex-1 md:flex-none btn btn-sm btn-error"
                onClick={() => openModal("cancel-transfer-account-modal")}
              >
                <CloseIcon />
                Cancel
              </button>
            ) : (
              <>
                <button
                  className="flex-1 md:flex-none btn btn-primary btn-sm"
                  onClick={() => openModal("accept-transfer-account-modal")}
                >
                  <CheckIcon />
                  Accept
                </button>
                <button
                  className="flex-1 md:flex-none btn btn-sm"
                  onClick={() => openModal("reject-transfer-account-modal")}
                >
                  <CloseIcon />
                  Reject
                </button>
              </>
            )}
          </div>
        )}
      </header>

      <div className="divider"></div>

      <h3>Activity</h3>
      <div className="rounded-lg py-5 px-6 my-4 bg-base-300 relative">
        <span className="w-[1px] h-full absolute left-6 top-0 bg-base-content/20"></span>

        {transfer.events.map((event, i) => (
          <div key={i} className="relative text-sm">
            <div className="flex flex-col items-start md:flex-row md:items-center md:gap-6 pl-6 py-4 md:py-3">
              <span className="text-highlight">{event.author}</span>
              <span className="text-neutral-content">{event.action}</span>
              <span className="opacity-80">{dateToDistance(event.date)}</span>
            </div>

            <span
              className={cn(
                "overflow-hidden rounded-full w-5 h-5 absolute left-0 top-[50%] translate-x-[-50%] translate-y-[-50%] grid place-items-center",
                /accept/.test(event.action)
                  ? "bg-success/20"
                  : /cancel|reject/.test(event.action)
                    ? "bg-error/20"
                    : "bg-base-content/10"
              )}
            >
              <span
                className={cn(
                  "rounded-full w-2 h-2",
                  /accept/.test(event.action)
                    ? "bg-success"
                    : /cancel|reject/.test(event.action)
                      ? "bg-error"
                      : "bg-base-content/50"
                )}
              ></span>
            </span>
          </div>
        ))}
      </div>
      <CancelTransferAccount />
      <RejectTransferAccount />
      <AcceptTransferAccount transfer={transfer} />
    </div>
  );
}

import { dateToDistance } from "@/utils/date";
import { trpc } from "@/utils/trpc";
import { CheckIcon, CloseIcon, DeleteIcon } from "@common/components/Icons";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { ssp } from "@common/server/ssp";
import { cn } from "@common/utils/classNames";
import { formatDistance } from "date-fns";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.fetchQuery("user.getAccountTransfer", {
      id: ctx.query.id as string,
    });
  });
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
  const transfer = trpc.useQuery([
    "user.getAccountTransfer",
    { id: router.query.id as string },
  ]);

  if (!transfer.data) {
    return <p>Transfer not found</p>;
  }

  const status = transfer.data.acceptedAt
    ? "confirmed"
    : transfer.data.rejectedAt
    ? "rejected"
    : "waiting";

  return (
    <div>
      <header className="grid gap-2">
        <div className="flex justify-between md:justify-start items-center gap-6">
          <h2 className="m-0">Transfer Request</h2>
          <span
            className={cn(
              "badge rounded-full px-4",
              status === "waiting" && "badge-info",
              status === "confirmed" && "badge-primary",
              status === "rejected" && "badge-error"
            )}
          >
            {status}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm">
            {transfer.data.isRequester ? "To" : "From"}{" "}
            <span className="text-highlight">
              {transfer.data.isRequester
                ? transfer.data.toUserEmail
                : transfer.data.fromUserEmail}
            </span>
          </span>
        </div>

        <div className="flex gap-2">
          {transfer.data.isRequester ? (
            <button className="flex-1 md:flex-none btn btn-sm btn-error">
              <CloseIcon />
              Cancel Request
            </button>
          ) : (
            <>
              <button className="flex-1 md:flex-none btn btn-primary btn-sm">
                <CheckIcon />
                Accept
              </button>
              <button className="flex-1 md:flex-none btn btn-sm">
                <CloseIcon />
                Reject
              </button>
            </>
          )}
        </div>
      </header>

      <div className="divider"></div>

      <h3>Activity</h3>
      <div className="rounded-lg py-5 px-6 my-4 bg-base-300 relative">
        <span className="w-[1px] h-full absolute left-6 top-0 bg-base-content/20"></span>

        {transfer.data.events.map((event, i) => (
          <div key={i} className="relative text-sm">
            <div className="flex flex-col items-start md:flex-row md:items-center md:gap-6 pl-6 py-4 md:py-3">
              <span className="text-highlight">{event.author}</span>
              <span className="text-neutral-content">{event.action}</span>
              <span className="opacity-80">{dateToDistance(event.date)}</span>
            </div>

            <span className="overflow-hidden rounded-full w-5 h-5 bg-base-300 absolute left-0 top-[50%] translate-x-[-50%] translate-y-[-50%] grid place-items-center">
              <span className="rounded-full w-2 h-2 bg-base-content/50"></span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

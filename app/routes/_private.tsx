import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Header } from "~/components/Header";
import { ENV } from "~/env.server";
import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  return typedjson({
    user,
    revision: ENV.APP_REVISION,
  });
}

export default function Private() {
  const { user, revision } = useTypedLoaderData<typeof loader>();

  return (
    <div>
      <Header user={user} revision={revision} />

      <Outlet />
    </div>
  );
}

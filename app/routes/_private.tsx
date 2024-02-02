import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Header } from "~/components/Header";
import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  return typedjson({
    user,
  });
}

export default function Private() {
  const { user } = useTypedLoaderData<typeof loader>();

  return (
    <div>
      <Header user={user} />

      <Outlet />
    </div>
  );
}

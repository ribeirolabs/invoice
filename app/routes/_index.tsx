import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { AUTH_INTENTS } from "./auth";

export const meta: MetaFunction = () => {
  return [{ title: "ribeirolabs / invoice" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect("/login");
  }

  return {
    user,
  };
}

export default function Index() {
  let data = useLoaderData<typeof loader>();
  let fetcher = useFetcher<{ ok: true } | { ok: false; message: string }>({
    key: "send-email",
  });

  return (
    <div>
      <h1>ribeirolabs / invoice</h1>
      <h3>Welcome, {data.user.email}</h3>

      <Form action="/auth/google" method="post">
        <button name="intent" value={AUTH_INTENTS.logout}>
          Logout
        </button>
      </Form>

      <fetcher.Form action="/email" method="post">
        <button disabled={fetcher.state === "submitting"}>Send Email</button>
        &nbsp;
        {fetcher.data?.ok ? (
          <span style={{ color: "green" }}>Sent!</span>
        ) : (
          <span style={{ color: "red" }}>{fetcher.data?.message}</span>
        )}
      </fetcher.Form>
    </div>
  );
}

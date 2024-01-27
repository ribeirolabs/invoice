import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
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

  return (
    <div>
      <h1>ribeirolabs / invoice</h1>
      <h3>Welcome, {data.user.email}</h3>
      <Form action="/auth/google" method="post">
        <button name="intent" value={AUTH_INTENTS.logout}>
          Logout
        </button>
      </Form>
    </div>
  );
}

import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { AUTH_INTENTS } from "./auth";

export async function loader({ request }: LoaderFunctionArgs) {
  if (await authenticator.isAuthenticated(request)) {
    return redirect("/");
  }

  return null;
}

export default function Login() {
  return (
    <Form action="/auth/google" method="post">
      <button name="intent" value={AUTH_INTENTS.login}>
        Login with Google
      </button>
    </Form>
  );
}

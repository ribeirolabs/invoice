import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  if (await authenticator.isAuthenticated(request)) {
    return redirect("/");
  }

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const provider = data.get("provider");

  if (!provider) {
    throw new Response(null, {
      status: 400,
      statusText: "Missing provider",
    });
  }

  return authenticator.authenticate(provider.toString(), request);
}

export default function Login() {
  return (
    <Form method="post">
      <button name="provider" value="google">
        Login with Google
      </button>
    </Form>
  );
}

import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { LoginIcon } from "~/components/Icons";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
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

  return authenticator.authenticate(provider.toString(), request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export default function Login() {
  return (
    <Form
      method="post"
      className="flex flex-col gap-2 items-center justify-center h-screen"
    >
      <div className="text-lg">
        <span className="text-neutral-500">ribeirolabs</span>
        <span className="font-bold text-primary"> / invoice</span>
      </div>

      <button name="provider" value="google" className="btn btn-primary">
        <LoginIcon />
        Entrar com Google
      </button>

      <pre>fly.io</pre>
    </Form>
  );
}

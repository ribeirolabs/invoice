import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { gmail, gmail_v1 } from "@googleapis/gmail";
import { getEmail } from "~/services/email.server";

export function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    return redirect("/login", {
      status: 401,
    });
  }
  try {
    const buffer = await getEmail(user.name, user.email);

    const response = await new Promise<gmail_v1.Schema$Message>(
      (resolve, reject) => {
        gmail("v1")
          .users.messages.send({
            access_token: user.accessToken,
            userId: user.id,
            requestBody: {
              raw: buffer.toString("base64"),
            },
          })
          .then((res) => {
            if (res.status > 200) {
              reject(res.statusText);
              return;
            }

            resolve(res.data);
          })
          .catch(reject);
      }
    );

    return json({ ok: true, ...response });
  } catch (e: any) {
    return json(
      {
        ok: false,
        message: e.message,
      },
      {
        status: 500,
      }
    );
  }
}

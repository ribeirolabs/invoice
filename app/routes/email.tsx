import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { gmail, gmail_v1 } from "@googleapis/gmail";
import { getEmail } from "~/services/email.server";

export function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const user = await authenticator.isAuthenticated(request);

    if (!user) {
      return redirect("/login", {
        status: 401,
      });
    }

    const data = await request.formData();
    const to = data.get("to");

    if (!to) {
      return json(
        {
          ok: false,
          message: "Missing `to`",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = await getEmail({ from: user, to: { email: to.toString() } });
    const payload: gmail_v1.Params$Resource$Users$Messages$Send = {
      access_token: user.accessToken,
      userId: user.id,
      requestBody: {
        raw: buffer.toString("base64"),
      },
    };

    const response = await new Promise<gmail_v1.Schema$Message>(
      (resolve, reject) => {
        gmail("v1")
          .users.messages.send(payload)
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

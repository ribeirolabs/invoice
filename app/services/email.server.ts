import { gmail_v1, gmail } from "@googleapis/gmail";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import { UserWithAccessToken } from "~/data/user.server";

export async function sendEmail({
  from,
  to,
  provider,
}: {
  from: UserWithAccessToken;
  to: string;
  provider: {
    accessToken: string;
    accountId: string;
  };
}) {
  const message = new MailComposer({
    to,
    from: `${from.name} <${from.email}>`,
    subject: "Test email from Remix",
    html: "<h1>It worked</h1>",
  });

  const buffer = await message.compile().build();

  console.log(provider);

  const payload: gmail_v1.Params$Resource$Users$Messages$Send = {
    access_token: provider.accessToken,
    userId: provider.accountId,
    requestBody: {
      raw: buffer.toString("base64"),
    },
  };

  return new Promise<gmail_v1.Schema$Message>((resolve, reject) => {
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
  });
}

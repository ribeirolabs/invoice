import { gmail_v1, gmail } from "@googleapis/gmail";
import { User } from "@prisma/client";
import MailComposer from "nodemailer/lib/mail-composer/index.js";
import { getValidAccount } from "~/data/user.server";
import Mail from "nodemailer/lib/mailer";

export async function sendEmail({
  user: user,
  to,
  attachments,
  subject,
  content,
}: {
  user: User;
  to: string;
  subject: string;
  content: string;
  attachments?: Mail.Attachment[];
}) {
  const account = await getValidAccount(user.id, "google");

  const message = new MailComposer({
    to,
    from: `${user.name} <${user.email}>`,
    subject,
    html: content,
    attachments: attachments ?? [],
  });

  const buffer = await message.compile().build();

  const payload: gmail_v1.Params$Resource$Users$Messages$Send = {
    access_token: account.access_token,
    userId: account.providerAccountId,
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

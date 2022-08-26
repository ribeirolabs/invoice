import { prisma } from "@/server/db/client";
import superjson from "superjson";
import { appRouter } from "@/server/router";
import { createSSGHelpers } from "@trpc/react/ssg";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "./auth/[...nextauth]";

export default async function restricted(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, nextAuthOptions);

  if (!session?.user) {
    res.redirect(`/auth/signin?callbackUrl=${req.url}`);
    return;
  }

  const {
    type,
    value,
    sharedBy: sharedById,
  } = req.query as {
    type: string;
    value: string;
    sharedBy: string;
  };

  if (type !== "company") {
    res.redirect("/");
  }

  const ssr = createSSGHelpers({
    router: appRouter,
    transformer: superjson,
    ctx: {
      session: session,
      prisma: prisma,
    },
  });

  await ssr.fetchQuery("company.share", {
    companyId: value,
    userId: session.user.id,
    sharedById: sharedById,
  });

  res.redirect(`/company/${value}`);
}

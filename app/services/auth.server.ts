import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { UserWithAccessToken } from "~/data/user.server";
import { gooleStrategy } from "./google.server";
import { User } from "@prisma/client";
import { redirect } from "@remix-run/node";

export const authenticator = new Authenticator<UserWithAccessToken>(
  sessionStorage
);

authenticator.use(gooleStrategy);

export async function requireUser(request: Request): Promise<User> {
  const user = await authenticator.isAuthenticated(request);

  if (!user) {
    throw redirect("/login");
  }

  return user;
}

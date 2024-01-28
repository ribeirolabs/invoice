import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { UserWithAccessToken } from "~/data/user.server";
import { gooleStrategy } from "./google.server";

export const authenticator = new Authenticator<UserWithAccessToken>(
  sessionStorage
);

authenticator.use(gooleStrategy);

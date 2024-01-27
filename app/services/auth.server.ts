import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { GoogleStrategy } from "remix-auth-google";
import invariant from "tiny-invariant";

type User = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
};

export let authenticator = new Authenticator<User>(sessionStorage);

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PORT, DOMAIN } = process.env;

invariant(GOOGLE_CLIENT_ID, "Missing `GOOGLE_CLIENT_ID` env variable");
invariant(GOOGLE_CLIENT_SECRET, "Missing `GOOGLE_SECRET` env variable");

const callbackURL = new URL(
  "/auth/google/callback",
  DOMAIN || "http://localhost"
);

if (PORT) {
  callbackURL.port = PORT;
}

let gooleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL.toString(),
    accessType: "offline",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.send",
    ],
  },
  async (response) => {
    const email = response.profile.emails[0].value;

    invariant(email, "Missing `email` from google response");

    return Promise.resolve({
      id: response.profile.id,
      email,
      name: response.profile.displayName,
      accessToken: response.accessToken,
    } as User);
  }
);

authenticator.use(gooleStrategy);

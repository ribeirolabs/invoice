import { GoogleStrategy } from "remix-auth-google";
import { loginUser } from "~/data/user.server";
import { ENV } from "~/env";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PORT, DOMAIN } = ENV;

const callbackURL = new URL(
  "/auth/google/callback",
  DOMAIN || "http://localhost"
);

if (PORT) {
  callbackURL.port = String(PORT);
}

export const gooleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL.toString(),
    accessType: "offline",
    prompt: "consent",
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.send",
    ],
  },
  loginUser
);

export async function refreshAccessToken(refreshToken: string) {
  const url =
    "https://oauth2.googleapis.com/token?" +
    new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      client_secret: GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const refreshedTokens = await response.json();

  if (!response.ok) {
    throw refreshedTokens;
  }

  // const safeTokens = refreshResponse.safeParse(refreshedTokens);
  //
  // if (!safeTokens.success) {
  //   throw new Error(
  //     `Invalid refresh_token response: ${safeTokens.error.message}`
  //   );
  // }

  return {
    access_token: refreshedTokens.access_token,
    expires_at: Date.now() + refreshedTokens.expires_in * 1000,
    refresh_token: refreshedTokens.refresh_token ?? refreshToken, // Fall back to old refresh token
  };
}

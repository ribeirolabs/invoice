import { Account, User } from "@prisma/client";
import { GoogleExtraParams, GoogleProfile } from "remix-auth-google";
import invariant from "tiny-invariant";
import { refreshAccessToken } from "~/services/google.server";
import prisma from "~/services/prisma.server";
import { populateInitialTasks } from "~/services/task.server";
import { getTimezone } from "~/utils";

export type UserWithAccessToken = User & {
  accessToken: string;
};

export async function getUserByProvider(provider: {
  name: string;
  accountId: string;
}): Promise<UserWithAccessToken | undefined> {
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: provider.name,
        providerAccountId: provider.accountId,
      },
    },
    include: {
      user: true,
    },
  });

  if (!account) {
    return;
  }

  return {
    ...account.user,
    accessToken: account.access_token,
  };
}

type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  extraParams: GoogleExtraParams;
  profile: GoogleProfile;
};

export async function signupUser({
  profile,
  extraParams,
  accessToken,
  refreshToken,
}: AuthResponse): Promise<UserWithAccessToken> {
  const email = profile.emails[0]?.value;

  invariant(email, "Missing `email` from auth profile");

  const user = await prisma.user.create({
    data: {
      email,
      locale: "en-US",
      timezone: getTimezone(),
      name: profile.displayName,
      image: profile.photos[0]?.value,
      accounts: {
        create: {
          type: "oauth",
          token_type: extraParams.token_type,
          provider: profile.provider,
          providerAccountId: profile.id,
          scope: extraParams.scope,
          id_token: extraParams.id_token,
          expires_at: Date.now() + extraParams.expires_in * 1000,
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      },
    },
  });

  return {
    ...user,
    accessToken,
  };
}

export async function loginUser(
  auth: AuthResponse
): Promise<UserWithAccessToken> {
  let user = await getUserByProvider({
    name: auth.profile.provider,
    accountId: auth.profile.id,
  });

  if (!user) {
    user = await signupUser(auth);
    await populateInitialTasks(user.id);
  }

  await prisma.account.update({
    data: {
      access_token: auth.accessToken,
      refresh_token: auth.refreshToken,
      expires_at: Date.now() * auth.extraParams.expires_in * 1000,
    },
    where: {
      provider_providerAccountId: {
        provider: auth.profile.provider,
        providerAccountId: auth.profile.id,
      },
    },
  });

  return {
    ...user,
    accessToken: auth.accessToken,
  };
}

export async function getValidAccount(
  userId: string,
  provider: string
): Promise<Account> {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      userId,
      provider,
    },
  });

  if (account.expires_at == null) {
    return account;
  }

  if (account.expires_at > Date.now()) {
    return account;
  }

  // TODO: Redirect to /login forcing the consent screen to we can get the refresh token.
  invariant(account.refresh_token, "Account expired and missing refresh token");

  console.info("[auth] refreshing expired token");
  const tokens = await refreshAccessToken(account.refresh_token);

  return prisma.account.update({
    data: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
    },
    where: {
      id: account.id,
    },
  });
}

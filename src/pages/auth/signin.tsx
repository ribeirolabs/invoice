import { InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: { providers },
  };
}

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <div className="grid h-screen w-screen place-content-center">
      {Object.values(providers ?? {}).map((provider) => (
        <button
          key={provider.name}
          className="btn btn-lg btn-primary"
          onClick={() =>
            signIn(provider.id, {
              callbackUrl: (router.query.callbackUrl as string | null) ?? "/",
            })
          }
        >
          Sign in with {provider.name}
        </button>
      ))}
    </div>
  );
}

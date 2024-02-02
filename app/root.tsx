import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import styles from "~/styles.css";
import { Header } from "./components/Header";
import { Logo } from "./components/Logo";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600;700;900&family=Rubik:ital,wght@0,400;0,500;0,700;0,800;1,400&display=swap",
  },
  { rel: "stylesheet", href: styles },
];

export default function App() {
  return (
    <html lang="pt-BR" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const ERROR_TRANSLATION: Record<string, string> = {
  "Not Found": "Página não encontrada",
};

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="pt-BR" data-theme="dark">
      <head>
        <title>Oops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="p-8">
        <Logo variant="full" className="text-md" />
        <div className="divider" />

        <main className="text-center">
          <h1 className="text-4xl font-black">
            {isRouteErrorResponse(error) ? (
              <>
                <span className="text-base-content/50 block">
                  {error.status}
                </span>{" "}
                <span>
                  {ERROR_TRANSLATION[error.statusText] ?? error.statusText}
                </span>
              </>
            ) : error instanceof Error ? (
              error.message
            ) : (
              "Erro Desconhecido"
            )}
          </h1>

          <p className="mt-2">
            <a href="/" className="link link-secondary font-semibold">
              Voltar
            </a>{" "}
            para página inicial
          </p>
        </main>

        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

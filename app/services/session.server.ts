import { createCookieSessionStorage } from "@remix-run/node";
import { ENV } from "./env.server";

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [ENV.AUTH_SECRET], // replace this with an actual secret
    secure: ENV.NODE_ENV === "production", // enable this in prod only
  },
});

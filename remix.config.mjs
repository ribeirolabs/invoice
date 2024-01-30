import { ENV } from "./app/env.js";

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  dev: {
    port: ENV.SOCKET_PORT,
  },
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};

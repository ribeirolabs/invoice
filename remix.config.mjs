/** @type {import('@remix-run/dev').AppConfig} */
export default {
  dev: {
    port: process.env.SOCKET_PORT,
  },
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: ["@ribeirolabs/events", "@ribeirolabs/events/react"]
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",
  serverModuleFormat: "cjs",
  serverBuildPath: "build/server/index.cjs",
  publicPath: "/build/",
  assetsBuildDirectory: "public/build",
  dev: { port: 8002 },
};

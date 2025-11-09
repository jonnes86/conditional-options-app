/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",

  // ⬇️ Build the *server* bundle as CJS so Node can require() it
  serverModuleFormat: "cjs",
  serverBuildPath: "build/server/index.cjs",

  publicPath: "/build/",
  assetsBuildDirectory: "public/build",

  // optional: you can remove these obsolete flags to silence the warning
  // future: {},
};

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  appDirectory: "app",

  // Build the server bundle as CommonJS
  serverModuleFormat: "cjs",
  serverBuildPath: "build/server/index.cjs",

  publicPath: "/build/",
  assetsBuildDirectory: "public/build",

  // (Optional) remove v2_* future flags to silence build warnings
  // future: {},
};

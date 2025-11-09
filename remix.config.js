/** @type {import('@remix-run/dev').AppConfig} */
export default {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildPath: "build/server/index.js",

  // 👇 the two lines that fix your runtime error
  serverPlatform: "node",
  serverModuleFormat: "cjs",

  ignoredRouteFiles: ["**/.*"],
  dev: { port: 8002 },

  // Those v2 flags are obsolete per your build warning; safe to remove.
  future: {},
};

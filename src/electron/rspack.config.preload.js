const rspack = require("@rspack/core");
const path = require("path");

const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";
const isDev = mode === "development";

/** @type {import('@rspack/cli').Configuration} */
const configRoot = {
  target: ["electron-preload"],
  context: __dirname,
  mode: "production",
  devtool: isDev ? "inline-source-map" : "source-map",
  node: {
    global: true,
  },
  output: {
    path: path.join(__dirname, "../../dist"),
    filename: "[name].js",
    library: {
      type: "umd",
    },
  },
  plugins: [
    new rspack.CopyRspackPlugin({
      from: path.join(__dirname, "./preload.js"),
      to: path.join(__dirname, "../../dist/preload.js"),
    }),
  ],
  resolve: {
    modules: ["src", "node_modules"],
  },
  builtins: {
    treeShaking: true,
    define: {
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      "process.env.APP_ENV": JSON.stringify(APP_ENV),
      "process.env.IS_ELECTRON_BUILD": true,
    },
  },
};

module.exports = configRoot;

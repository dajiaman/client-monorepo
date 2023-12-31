const { defineConfig } = require("@rspack/cli");
const path = require("path");

const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";
const isDev = mode === "development";

/** @type {import('@rspack/cli').Configuration} */
const configRoot = {
  target: ["electron-preload"],
  context: __dirname,
  mode: mode,
  entry: {
    telegram: "./src/telegram/index.ts",
    whatsapp: "./src/whatsapp/index.ts",
  },
  devtool: isDev ? "inline-source-map" : false,
  node: {
    global: true,
  },
  output: {
    path: path.join(__dirname, "../../dist/business/preloads"),
    filename: "[name]/index.js",
    library: {
      type: "umd",
    },
  },
  externals: {
    cld: "cld",
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: [
          {
            loader: "node-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      lib: path.resolve(__dirname, "../lib/src"),
    },
    modules: ["src", "node_modules"],
  },
  cache: false,
  builtins: {
    treeShaking: true,
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.APP_ENV": JSON.stringify(process.env.APP_ENV),
      "process.env.IS_ELECTRON_BUILD": true,
    },
  },
};

module.exports = configRoot;

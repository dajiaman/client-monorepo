const rspack = require("@rspack/core");
const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";
const isDev = mode === "development";
const path = require("path");

/** @type {import('@rspack/cli').Configuration} */
const configRoot = {
  target: ["electron-main"],
  context: __dirname,
  mode: mode,
  entry: {
    main: "./src/index.ts",
  },
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
  plugins: [
    new rspack.CopyRspackPlugin({
      from: path.join(__dirname, "./preload.js"),
      to: path.join(__dirname, "../../dist/preload.js"),
    }),
  ],
  resolve: {
    modules: ["src", "node_modules"],
  },
};

module.exports = configRoot;

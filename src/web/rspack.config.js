const rspack = require("@rspack/core");
const path = require("path");
const ReactRefreshPlugin = require("@rspack/plugin-react-refresh");
const { config } = require("dotenv");
const { parsed } = config({ path: ".env." + process.env.ENV_MODE });

const isDev = process.env.NODE_ENV === "development";
const { PORT, APP_ENV, NODE_ENV } = parsed;

/** @type {import('@rspack/cli').Configuration} */
const configRoot = {
  experiments: {
    rspackFuture: {
      disableTransformByDefault: true,
    },
  },
  cache: false,
  target: ["web", "electron-renderer", "es2015"],
  context: __dirname,
  mode: isDev ? "development" : "production",
  entry: {
    main: "./src/index.tsx",
  },
  devtool: isDev ? "inline-source-map" : "source-map",
  node: {
    global: true,
  },
  output: {
    filename: isDev ? "[name].js" : "[name].[contenthash:8].js",
    chunkFilename: isDev ? "[name].js" : "[name].[contenthash:8].js",
    path: path.join(__dirname, "../../dist/web"),
  },
  optimization: {
    realContentHash: true,
    splitChunks: {
      cacheGroups: {
        someVendor: {
          chunks: "all",
          minChunks: 2,
        },
      },
    },
  },
  devServer: {
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Origin": "*",
    },
    port: Number(PORT),
    hot: true,
    historyApiFallback: true,
    open: false,
  },
  module: {
    rules: [
      // less
      {
        test: /\.less$/,
        use: ["less-loader"],
        type: "css",
        options: {
          lessOptions: {
            modifyVars: {
              "radio-border-width": "1px",
            },
            javascriptEnabled: true,
          },
        },
      },
      {
        test: /\.module\.less$/,
        use: "less-loader",
        type: "css/module",
      },
      {
        test: /\.svg$/i,
        issuer: /\.tsx?$/,
        use: [{ loader: "@svgr/webpack", options: { exportType: "named" } }],
      },
      {
        test: /\.(j|t)s$/,
        exclude: [/[\\/]node_modules[\\/]/],
        loader: "builtin:swc-loader",
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: "typescript",
            },
            externalHelpers: true,
          },
        },
      },
      {
        test: /\.(j|t)sx$/,
        loader: "builtin:swc-loader",
        exclude: [/[\\/]node_modules[\\/]/],
        options: {
          sourceMap: true,
          jsc: {
            parser: {
              syntax: "typescript",
              tsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
                development: isDev,
                refresh: isDev,
              },
            },
            externalHelpers: true,
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(webp|png|jpe?g|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /^BUILD_ID$/,
        type: "asset/source",
      },
    ],
  },
  plugins: [
    isDev && new rspack.SwcCssMinimizerRspackPlugin(),
    isDev &&
      new rspack.SwcJsMinimizerRspackPlugin({
        dropConsole: !isDev,
        comments: !isDev,
      }),
    new rspack.ProvidePlugin({
      process: [require.resolve("process/browser")],
    }),
    new rspack.HtmlRspackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.png",
      minify: !isDev,
    }),
    isDev && new ReactRefreshPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      lib: path.resolve(__dirname, "../lib/src"),
    },
  },
  builtins: {
    treeShaking: true,
    define: {
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
      "process.env.APP_ENV": JSON.stringify(APP_ENV),
    },
  },
};

module.exports = configRoot;

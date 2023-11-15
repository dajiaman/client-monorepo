const { defineConfig } = require("@rspack/cli");
const path = require("path");

const mode =
	process.env.NODE_ENV === "development" ? "development" : "production";
const isDev = mode === "development";

/** @type {import('@rspack/cli').Configuration} */
const configRoot = defineConfig(() => {
	return {
		target: ["electron-preload"],
		context: __dirname,
		watch: true,
		mode: mode,
		entry: {
			telegram: "./src/telegram/index.ts",
			whatsapp: "./src/whatsapp/index.ts",
		},
		devtool: isDev ? "inline-source-map" : "source-map",
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
			modules: ["src", "node_modules"],
		},
	};
});

module.exports = configRoot;

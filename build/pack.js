const builder = require("electron-builder");
const Platform = builder.Platform;
const product = require("../product.json");

const productName = "基础功能01";
const artifactName = productName + ".${ext}";

// Let's get that intellisense working
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const buildOptions = {
	appId: "com.example.app002",
	productName: productName,
	directories: {
		output: "release",
	},
	artifactName: artifactName,
	// force arch build if using electron-rebuild
	// beforeBuild: async (context) => {
	//   const { appDir, electronVersion, arch } = context;
	//   await electronRebuild.rebuild({ buildPath: appDir, electronVersion, arch });
	//   return false;
	// },
	// afterSign: async (context) => {
	//   console.log("afterSign");
	// },
	// artifactBuildStarted: (context) => {
	//   console.log("artifactBuildStarted");
	// },
	win: {
		target: "nsis",
		artifactName: artifactName,
	},
	nsis: {
		oneClick: true,
		perMachine: true,
		allowToChangeInstallationDirectory: false,
		deleteAppDataOnUninstall: false,
	},
	asar: false,
	files: ["dist/**/*"],
	extraMetadata: {
		name: product.nameLong,
		version: "1.0.0",
	},
};

// electron builder build
builder
	.build({
		targets: Platform.WINDOWS.createTarget(),
		config: buildOptions,
	})
	.then(() => {
		console.log("Package success");
	})
	.catch((err) => {
		console.log(err);
	});

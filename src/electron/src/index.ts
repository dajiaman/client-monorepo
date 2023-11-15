import { BrowserWindow, app, ipcMain, protocol } from "electron";
import { ViewsService } from "./viewsService";
import path from "node:path";

// @ts-ignore
global.globalObject = {
	selectedSessionId: "",
};

app.commandLine.appendSwitch("js-flags", "--expose-gc");

protocol.registerSchemesAsPrivileged([
	{
		scheme: "https",
		privileges: {
			secure: false,
			bypassCSP: true,
			corsEnabled: true,
		},
	},
]);

protocol.registerSchemesAsPrivileged([
	{
		scheme: "http",
		privileges: {
			secure: true,
			standard: true,
			bypassCSP: true,
			corsEnabled: true,
		},
	},
]);

const viewsService = new ViewsService();

app.once("ready", () => {
	console.log("Hello from Electron!");
	const preloadPath = path.join(__dirname, "./preload.js");
	console.log("preloadPath: ", preloadPath);

	// Create a new window
	const window = new BrowserWindow({
		width: 1280,
		height: 800,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			preload: preloadPath
		},
	});
	// @ts-ignore
	global.window = window;

	// if (process.env.NODE_ENV === "development") {
	//   window.loadURL(`http://localhost:3001`);
	// } else {
	//   window.loadURL(`file://${__dirname}/../../index.html`);
	// }

	window.loadURL(`file://${path.resolve(__dirname, "./web/index.html")}`);
	window.webContents.openDevTools();

	window.once("ready-to-show", () => {
		console.log("ready-to-show");
	});

	ipcMain.handle("open-browser-view", async (_e, arg) => {
		console.log("open-browser-view", arg);

		if (viewsService.getViewCount() > 0) {
			viewsService.hideAllViews();
		}

		const { sessionId } = arg;
		viewsService.openView(sessionId, `https://web.telegram.org/a/`, {
			webPreferences: {
				nodeIntegration: false,
				// contextIsolation: false,
				javascript: true,
			},
		});

		if (viewsService.getViewByName(sessionId)) {
			window.addBrowserView(viewsService.getViewByName(sessionId)?.view!);
		}
	});

	ipcMain.handle("show-browser-view", async (_e, args) => {
		console.log("show-browser-view", args);
		const { sessionId } = args;

		if (viewsService.getViewCount() > 0) {
			viewsService.hideAllViews();
		}

		viewsService.getViewByName(sessionId)?.fitWindow();
	});

	ipcMain.handle("hide-all-browser-view", async () => {
		console.log("hide-all-browser-view");
		if (viewsService.getViewCount() > 0) {
			viewsService.hideAllViews();
		}
	});
});

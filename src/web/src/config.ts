console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
console.log("process.env.APP_ENV:", process.env.APP_ENV);

export const IS_TEST = process.env.APP_ENV === "test";
export const IS_PERF = process.env.APP_ENV === "perf";
// beta环境
export const IS_BETA = process.env.APP_ENV === "staging";
export const IS_ELECTRON_BUILD = process.env.IS_ELECTRON_BUILD;

export const IS_DEV = process.env.NODE_ENV === "development";

export const DEBUG = process.env.APP_ENV !== "production";

export const TITLEBAR_HEIGHT = 0;
export const ACTIVITYBAR_WIDTH = 72;
export const SESSIONLISTBAR_WIDTH = 230;

export const RIGHTPANEL_WIDTH = 300;

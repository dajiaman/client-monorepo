import appLocaleZhCN from "./zh-CN.json";
import appLocaleZhTW from "./zh-TW.json";
import appLocaleEnUS from "./en.json";

const resources = {
    "zh-CN": {
        translation: {
            ...appLocaleZhCN,
        },
    },
    "zh-TW": {
        translation: {
            ...appLocaleZhTW,
        },
    },
    "en-US": {
        translation: {
            ...appLocaleEnUS,
        },
    },
};
export default resources;

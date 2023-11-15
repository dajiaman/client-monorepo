export function getPlatform() {
    const { userAgent, platform } = window.navigator;

    const iosPlatforms = ["iPhone", "iPad", "iPod"];
    if (
        iosPlatforms.indexOf(platform) !== -1 ||
        // For new IPads with M1 chip and IPadOS platform returns "MacIntel"
        (platform === "MacIntel" &&
            "maxTouchPoints" in navigator &&
            navigator.maxTouchPoints > 2)
    )
        return "iOS";

    const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
    if (macosPlatforms.indexOf(platform) !== -1) return "macOS";

    const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
    if (windowsPlatforms.indexOf(platform) !== -1) return "Windows";

    if (/Android/.test(userAgent)) return "Android";

    if (/Linux/.test(platform)) return "Linux";

    return undefined;
}

export const PLATFORM_ENV = getPlatform();
export const IS_MAC_OS = PLATFORM_ENV === "macOS";
export const IS_WINDOWS = PLATFORM_ENV === "Windows";
export const IS_LINUX = PLATFORM_ENV === "Linux";
export const IS_IOS = PLATFORM_ENV === "iOS";
export const IS_ANDROID = PLATFORM_ENV === "Android";
export const IS_MOBILE = IS_IOS || IS_ANDROID;

export const IS_ELECTRON = Boolean(window.electron);

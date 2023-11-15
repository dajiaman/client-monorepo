import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { DEBUG } from "../config";
import resources from "./resource";

i18next
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: "en",
        debug: DEBUG,
        resources: resources,
        detection: {
            order: ["querystring", "localStorage", "navigator", "htmlTag"],
            lookupQuerystring: "lng",
            lookupLocalStorage: "language",
            caches: ["localStorage"],
            // optional htmlTag with lang attribute, the default is:
            htmlTag: document.documentElement,
        },
    })
    .then((t) => {
        // initialized and ready to go!
        const lng = i18next.language;
        document.documentElement.lang = lng;
    });

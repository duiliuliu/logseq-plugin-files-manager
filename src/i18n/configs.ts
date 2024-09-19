import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 言語jsonファイルのimport
import translation_en from "./en.json";
import translation_ja from "./ja.json";
import translation_cn from "./cn.json";

const resources = {
    ja: {
        translation: translation_ja
    },
    en: {
        translation: translation_en
    },
    "zh-CN": {
        translation: translation_cn
    },
    "zh-Hant": {
        translation: translation_cn
    },
};

i18n.use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
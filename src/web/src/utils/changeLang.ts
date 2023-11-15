import i18next from "i18next";

function changeLang(lang: string) {
  i18next.changeLanguage(lang);
  document.documentElement.lang = lang;
}

export default changeLang;

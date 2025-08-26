import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { DateTime } from "luxon";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

function getEnOrdinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

i18n.services?.formatter?.add("DATE_HUGE", (value, lng) => {
  const parsedDate = DateTime.fromJSDate(value);
  const month = parsedDate.setLocale(lng).toFormat("MMMM");
  console.log({ parsedDate });
  if (lng === "en") {
    return `${month} ${getEnOrdinal(parsedDate.c.day)}`;
  }

  return `${parsedDate.c.day}. ${month}`;
});

export default i18n;

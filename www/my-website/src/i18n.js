// src/i18n.js
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./locales/en.json"
import es from "./locales/es.json"
import it from "./locales/it.json"

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    it: { translation: it },
    es: { translation: es },
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

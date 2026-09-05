import React, { createContext, useState, useContext } from "react";
// AJOUTEZ CETTE LIGNE CI-DESSOUS
import { translations } from "../lib/translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("fr"); // 'fr' ou 'en'

  const t = (path) => {
    if (!path) return "";
    const keys = path.split(".");
    let value = translations[lang];

    keys.forEach((key) => {
      if (value && value[key]) {
        value = value[key];
      } else {
        value = path; // Retourne la clé si la traduction manque
      }
    });
    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

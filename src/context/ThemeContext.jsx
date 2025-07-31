import React, { createContext, useContext, useEffect, useState } from "react";
import tinycolor from "tinycolor2"; // helps generate hover shades

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState("#d0021b");

  useEffect(() => {
    const lightColor = tinycolor(primaryColor).lighten(35).toHexString();
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty("--primary-color-light", lightColor);
    document.documentElement.style.setProperty("--text-color", primaryColor);
    document.documentElement.style.setProperty("--hover-underline", primaryColor);
  }, [primaryColor]);

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

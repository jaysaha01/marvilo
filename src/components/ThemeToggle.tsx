"use client";

import { useThemeContext } from "@/context/ThemeContext";
import { Button } from "@mui/material";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (

    <Button variant="contained" onClick={toggleTheme} className="modebutton">{mode === "dark" ? "Light Mode" :"Dark Mode"}</Button>
                      
  );
};

export default ThemeToggle;

"use client";

import { MonitorCog } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
const key = "relay-theme";

function savedTheme(): Theme {
  try {
    const value = localStorage.getItem(key);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function ThemeControl() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const sync = () => {
      const value = savedTheme();
      setTheme(value);
      if (value === "system") document.documentElement.removeAttribute("data-theme");
      else document.documentElement.dataset.theme = value;
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function changeTheme(value: Theme) {
    setTheme(value);
    if (value === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.dataset.theme = value;
    try {
      if (value === "system") localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch { /* The selected theme still works for this page when storage is unavailable. */ }
  }

  return <label className="theme-control">
    <MonitorCog size={16} strokeWidth={1.8} aria-hidden="true" />
    <span className="sr-only">Appearance</span>
    <select aria-label="Appearance theme" value={theme} onChange={(event) => changeTheme(event.target.value as Theme)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  </label>;
}

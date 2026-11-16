"use client"

import { useEffect, useState } from "react"

type Theme = "light" | "dark"

const STORAGE_KEY = "theme"

const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.setAttribute("data-mode", theme)
  root.style.colorScheme = theme
}

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
  }, [])

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    setTheme(next)
    applyTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="hover:text-ui-fg-base"
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      data-testid="theme-toggle"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  )
}

export default ThemeToggle

"use strict";

// checks if theme is stored before by user
const storedTheme = localStorage.getItem("theme");

// checks for user default preference
const darkPreference = window.matchMedia("(prefers-color-scheme:dark)").matches;

const theme = storedTheme || (darkPreference ? "dark" : "light");

document.documentElement.setAttribute("data-theme", theme);

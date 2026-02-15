"use strict";

const toggle = document.querySelector("#theme-toggle");

toggle.addEventListener("click", () => {
  let theme = localStorage.getItem("theme");
  if (theme === "light") {
    setDarkTheme();
  } else {
    setLightTheme();
  }
});

function setDarkTheme() {
  localStorage.setItem("theme", "dark");
  document.documentElement.setAttribute("data-theme", "dark");
}

function setLightTheme() {
  localStorage.setItem("theme", "light");
  document.documentElement.setAttribute("data-theme", "light");
}

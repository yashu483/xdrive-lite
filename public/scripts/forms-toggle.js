"use strict";

// this file includes toggle related logics

const overlay = document.getElementById("overlay");
const bottomSheet = document.getElementById("bottomSheet");
const input = document.getElementById("folderName");
const createBtn = document.getElementById("createBtn");

function openModal() {
  bottomSheet.classList.remove("not-active");
  overlay.classList.add("active");
  bottomSheet.classList.add("active");
}

function closeModal() {
  overlay.classList.remove("active");
  bottomSheet.classList.remove("active");
  bottomSheet.classList.add("not-active");
  bottomSheet.addEventListener("submit", (e) => {
    bottomSheet.requestSubmit();
  });
}

function handleInput() {
  if (input.value.trim().length > 0) {
    createBtn.disabled = false;
    createBtn.classList.add("enabled");
  } else {
    createBtn.disabled = true;
    createBtn.classList.remove("enabled");
  }
}

// folder card options button toggle

const optionBtn = document.querySelectorAll(".options-button");
const folderOptions = document.querySelectorAll(".card-menu-options");

let selectedFolderIndex = 0;

const closeOptionsMenu = () => {
  folderOptions.forEach((btn) => {
    btn.classList.remove("open");
  });
};

optionBtn.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    folderOptions[selectedFolderIndex].classList.remove("open");
    folderOptions[index].classList.toggle("open");
    selectedFolderIndex = index;
  });
});

document.addEventListener("click", closeOptionsMenu);

// disabled feature- asks user if they want to delete the folder

/*const folderDeleteLinks = document.querySelectorAll(".folder-delete-link");

folderDeleteLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    const allow = confirm(
      "Do you want to delete the folder? All of its content will be deleted permanently!",
    );
    if (allow) {
      window.location.href = link.href;
    } else {
      closeOptionsMenu();
    }
  });
});*/

"use strict";

// this file contains functionality for folders page

const folderCards = document.querySelectorAll(".folder-card.isFolder");

folderCards.forEach((folder) => {
  folder.addEventListener("click", (e) => {
    if (e.target.closest(".folder-menu-section")) return;

    const folderId = e.currentTarget.id;
    window.location.href = `/folders/${folderId}`;
  });
});

const errorContainer = document.querySelector("#folder-errors-container");
const errorCloseBtn = document.querySelector("#folder-error-close-btn");
if (errorCloseBtn) {
  errorCloseBtn.addEventListener("click", () => {
    errorContainer.remove();
  });
}


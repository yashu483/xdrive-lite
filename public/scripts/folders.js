"use strict";

// this file contains functionality for folders page

const folderCards = document.querySelectorAll(".folder-card.isFolder");

folderCards.forEach((folder) => {
  folder.addEventListener("click", (e) => {
    const targetId = e.target.id;

    window.location.href = `/folders/${targetId}`;
  });
});

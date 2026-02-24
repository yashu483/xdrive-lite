"use strict";

const fileInput = document.querySelector("#file");
const fileForm = document.querySelector("#files-form");

const createErrorElements = (msg) => {
  const errorContainer = document.createElement("div");
  const ulErrContainer = document.createElement("ul");
  const errCloseBtn = document.createElement("button");

  errorContainer.setAttribute("id", "file-errors-container");
  errCloseBtn.setAttribute("id", "file-err-close-btn");
  errorContainer.classList.add("errors-container");
  errCloseBtn.textContent = "X";
  errCloseBtn.addEventListener("click", () => {
    errorContainer.remove();
  });

  msg.forEach((message) => {
    const liErrMsg = document.createElement("li");
    liErrMsg.textContent = message;
    ulErrContainer.appendChild(liErrMsg);
  });

  errorContainer.append(errCloseBtn, ulErrContainer);
  return errorContainer;
};

fileInput.addEventListener("change", function (e) {
  const maxFiles = 3;
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const files = this.files;

  // check file count
  if (files.length > maxFiles) {
    //remove previous errors
    const existedErrContainer = document.querySelector(
      "#file-errors-container",
    );
    if (existedErrContainer) existedErrContainer.remove();

    const heading = document.querySelector(".folder-section-heading");
    const errorContainer = createErrorElements([
      `You can only upload maximum of ${maxFiles} files at once.`,
    ]);
    heading.insertAdjacentElement("afterend", errorContainer);
    this.value = "";
    return;
  }

  // check each file size
  const sizeErrors = [];
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSizeBytes) {
      sizeErrors.push(
        `File "${files[i].name}" is too large! Maximum size is ${maxSizeMB}MB`,
      );
      this.value = "";
    }
  }
  if (sizeErrors.length > 0) {
    const existedErrContainer = document.querySelector(
      "#file-errors-container",
    );
    if (existedErrContainer) existedErrContainer.remove();

    const heading = document.querySelector(".folder-section-heading");
    const errorContainer = createErrorElements(sizeErrors);
    heading.insertAdjacentElement("afterend", errorContainer);

    return;
  }
  if (files.length > 0) {
    fileForm.requestSubmit();
  }
});

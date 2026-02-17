"use strict";

const fileInput = document.querySelector("#file");
const fileForm = document.querySelector("#files-form");

fileInput.addEventListener("change", function (e) {
  const maxFiles = 3;
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const files = this.files;

  // check file count
  if (files.length > maxFiles) {
    alert(`You can only upload maximum of ${maxFiles} files at once.`);
    this.value = "";
    return;
  }

  // check each file size
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxSizeBytes) {
      alert(`File ${files[i].name} is too large! Max size is ${maxSizeMB}MB`);
      this.value = "";
      return;
    }
  }
  if (files.length > 0) {
    fileForm.requestSubmit();
  }
});

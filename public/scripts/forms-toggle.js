const overlay = document.getElementById("overlay");
const bottomSheet = document.getElementById("bottomSheet");
const input = document.getElementById("folderName");
const createBtn = document.getElementById("createBtn");

function openModal() {
  bottomSheet.classList.remove("not-active");
  overlay.classList.add("active");
  bottomSheet.classList.add("active");
  // bottomSheet.style.display = "block";
}

function closeModal() {
  overlay.classList.remove("active");
  // bottomSheet.style.display = "none";
  bottomSheet.classList.remove("active");
  bottomSheet.classList.add("not-active");
  bottomSheet.addEventListener("submit", (e) => {
    bottomSheet.requestSubmit();
  });
}
// createBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   bottomSheet.requestSubmit();
// });
function handleInput() {
  if (input.value.trim().length > 0) {
    createBtn.disabled = false;
    createBtn.classList.add("enabled");
  } else {
    createBtn.disabled = true;
    createBtn.classList.remove("enabled");
  }
}

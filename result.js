let resultPlace = document.querySelector("#resultShow");
let buttonNewGame = document.querySelector("#newGame");
let correctResult = localStorage.getItem("endResult");

window.addEventListener("load", () => {
  resultPlace.textContent = correctResult;
});

buttonNewGame.addEventListener("click", () => {
  window.location.href = "index.html";
});

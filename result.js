let resultP = document.querySelector("#resultShow");
let buttonNewGame = document.querySelector("#newGame");
let correctResult = localStorage.getItem("endResult");

window.addEventListener("load", () => {
  resultP.textContent = correctResult;
});

buttonNewGame.addEventListener("click", () => {
  window.location.href = "index.html";
});

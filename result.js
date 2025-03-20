let resultPlace = document.querySelector("#resultShow");
let buttonNewGame = document.querySelector("#newGame");
let finalScore = localStorage.getItem("endResult");

window.addEventListener("load", () => {
  resultPlace.textContent = finalScore;
});

buttonNewGame.addEventListener("click", () => {
  window.location.href = "index.html";
});
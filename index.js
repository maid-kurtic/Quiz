let buttonPlay = document.querySelector("#button-play");
let form = document.querySelector("form");
let radioDiv = document.querySelectorAll(".radio-div");
let inputs = document.querySelectorAll("input");
let categoryButton = document.querySelector(".category-button");
let categories = document.querySelectorAll("a");
let categoryDiv = document.querySelector(".category-list");
let difficultyDiv = document.querySelector(".select-div");
let selectedCategoriesSet = new Set();
let selectedCategoriesArr = [];
let selectedDifficulty;
let difficulties = [...document.getElementsByName("difficulty")];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

window.addEventListener("pageshow", () => {
  inputs.forEach((e) => {
    e.checked = false;
  });
  localStorage.clear();
});

difficulties.forEach((e) => {
  e.addEventListener("click", () => {
    if (difficultyDiv.classList.contains("error")) {
      difficultyDiv.classList.remove("error");
    }

    selectedDifficulty = e.id;
    localStorage.setItem("selectedDifficulty", selectedDifficulty);
  });
});

categoryButton.addEventListener("click", () => {
  if (categoryButton.classList.contains("error")) {
    categoryButton.classList.remove("error");
  }
  if (selectedCategoriesArr.length == 0) {
    categoryButton.textContent = "Select categories";
    categoryButton.style.color = "black";
  } else {
    categoryButton.textContent = "Category selected";
    categoryButton.style.color = "green";
  }
  categoryDiv.classList.toggle("show");
});

categories.forEach((category) => {
  category.addEventListener("click", () => {
    if (selectedCategoriesSet.has(category.id)) {
      selectedCategoriesSet.delete(category.id);
    } else {
      selectedCategoriesSet.add(category.id);
    }
    selectedCategoriesArr = [...selectedCategoriesSet];
    category.classList.toggle("selected");
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

buttonPlay.addEventListener("click", () => {
  localStorage.setItem( "selectedCategories", JSON.stringify(selectedCategoriesArr));
  if (
    localStorage.getItem("selectedDifficulty") == null ||
    localStorage.getItem("selectedCategories") == null
  ) {
    categoryButton.classList.add("error");
    difficultyDiv.classList.add("error");
    setTimeout(() => alert("Choose a category and level."), 500);
  } else {
    window.location.href = "playing.html";
  }
});

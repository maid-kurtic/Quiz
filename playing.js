let difficulty = document.querySelector("#difficulty");
let category = document.querySelector("#category");
let answersDiv = document.querySelector("#answers");
let buttonStart = document.querySelector("button");
let answers = document.querySelectorAll(".answer");
let question = document.querySelector("#question");
let timerPlace = document.querySelector("#timer");
let questionDiv = document.querySelector("#question-div");
let container = document.querySelector("#container");
let selectedDifficulty = localStorage.getItem("selectedDifficulty");
let selectedCategories = JSON.parse(localStorage.getItem("selectedCategories"));
let categoriesForURL;
let allQuestions = [];
let correctAnswers = [];
let incorrectAnswers = [];
let allAnswers = [];
let score = 5;
let counter = 0;
let stopTimer = false;

questionDiv.style.display = "none";
answersDiv.style.pointerEvents = "none";
timerPlace.style.display = "none";
difficulty.textContent = selectedDifficulty.toUpperCase();

window.addEventListener("pageshow", () => {
  if (selectedCategories.length > 1)
    category.textContent = `${selectedCategories.length} categories`.toUpperCase();
  else category.textContent = selectedCategories[0].toUpperCase();
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCategoriesForURL = () => {
  categoriesForURL = selectedCategories.join();
};

const fetchQuestions = async (selectedCategories, difficulty) => {
  try {
    getCategoriesForURL();
    let fetchQuestions = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${categoriesForURL}&difficulties=${difficulty}&limit=5`
    );

    let questionsObj = await fetchQuestions.json();
    allQuestions = questionsObj.map((q) => q.question.text);
    correctAnswers = questionsObj.map((q) => q.correctAnswer);
    incorrectAnswers = questionsObj.map((q) => q.incorrectAnswers);

    return { allQuestions, correctAnswers, incorrectAnswers };
  } catch (err) {
    alert(err.message);
  }
};

const highlightCorrectAnswer = () => {
  answers.forEach((answer) => {
    if (correctAnswers.includes(answer.value)) {
      answer.style.backgroundColor = "green";
    }
  });
};

const handleQuestion = async () => {
  await wait(1300);
  question.textContent = allQuestions[counter];
  allAnswers = [correctAnswers[counter], ...incorrectAnswers[counter]];
  allAnswers.sort(() => Math.random() - Math.random());
  allAnswers.forEach((answer, i) => {
    answers[i].value = answer;
    answers[i].textContent = answer;
    answers[i].style.backgroundColor = "#007bff";
    answers[i].style.pointerEvents = "auto";
  });
  counter++;
};

const toResultPage = async () => {
  localStorage.setItem("endResult", score);
  await wait(1300);
  window.location.href = "result.html";
};

const clickDisable = () => {
  answers.forEach((answer) => {
    answer.style.pointerEvents = "none";
  });
};

const timer = async () => {
  let time = 15;
  while (time >= 0) {
    if (stopTimer) return;
    await wait(1000);
    timerPlace.textContent = time;

    if (time === 0 && counter === allQuestions.length) {
      score--;
      clickDisable();
      highlightCorrectAnswer();
      toResultPage();
      return;
    } else if (time === 0) {
      score--;
      clickDisable();
      highlightCorrectAnswer();
      await handleQuestion();
      await timer();
    }
    time--;
  }
};

buttonStart.addEventListener("click", async () => {
  buttonStart.style.pointerEvents = "none";
  await fetchQuestions(categoriesForURL, selectedDifficulty);
  await handleQuestion();
  container.style.backgroundImage = "none";
  buttonStart.style.display = "none";
  questionDiv.style.display = "block";
  timerPlace.style.display = "block";
  await timer(1000);
});

answersDiv.addEventListener("click", async (event) => {
  stopTimer = true;
  clickDisable();
  if (!correctAnswers.includes(event.target.value)) {
    score--;
    highlightCorrectAnswer();
    event.target.style.backgroundColor = "red";
  } else {
    highlightCorrectAnswer();
  }
  if (counter === allQuestions.length) {
    toResultPage();
    return;
  }
  await handleQuestion();
  stopTimer = false;
  await timer();
});

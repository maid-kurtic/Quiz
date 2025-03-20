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
let allQuestions = [];
let correctAnswers = [];
let incorrectAnswers = [];
let allAnswers = [];
let correctAnswersResult = 5;
let counter = 0;
let categoryURL = [];
let stopTimer = false;
const categories = {
  general: "general_knowledge",
  history: "history",
  geography: "geography",
  movies: "film_and_tv",
  music: "music",
  sport: "sport_and_leisure",
};

if (selectedCategories.length > 1)
  category.textContent =
    ` ${selectedCategories.length} categories`.toUpperCase();
else category.textContent = selectedCategories[0].toUpperCase();

difficulty.textContent = selectedDifficulty.toUpperCase();
questionDiv.style.display = "none";
answersDiv.style.pointerEvents = "none";
timerPlace.style.display = "none";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getCategoryIds = () => {
  selectedCategories.forEach((e) => {
    categoryURL.push(categories[`${e}`]);
  });
};

const fetchQuestions = async (selectedCategories, difficulty) => {
  try {
    getCategoryIds(selectedCategories);
    let fetchQuestions = await fetch(
      `https://the-trivia-api.com/v2/questions?categories=${categoryURL}&difficulties=${difficulty}&limit=5`
    );

    let questionsObj = await fetchQuestions.json();
    questionsObj.forEach((e) => {
      allQuestions.push(e.question.text);
      correctAnswers.push(e.correctAnswer);
      incorrectAnswers.push(e.incorrectAnswers);
    });
    return { allQuestions, correctAnswers, incorrectAnswers };
  } catch (err) {
    alert(err.message);
  }
};

const highlightCorrectAnswer = () => {
  answers.forEach((e, i) => {
    if (correctAnswers.includes(e.value)) {
      answers[i].style.backgroundColor = "green";
    }
  });
};

const nextQuestion = async () => {
  await wait(1300);
  question.textContent = allQuestions[counter];
  allAnswers = [correctAnswers[counter], ...incorrectAnswers[counter]];
  allAnswers.sort(() => Math.random() - 0.5);
  allAnswers.forEach((e, i) => {
    answers[i].value = e;
    answers[i].textContent = e;
    answers[i].style.backgroundColor = "#007bff";
    answers[i].style.pointerEvents = "auto";
  });
  counter++;
};

const toResultPage = async () => {
  localStorage.setItem("endResult", correctAnswersResult);
  await wait(1300);
  window.location.href = "result.html";
};

const clickDisable = () => {
  allAnswers.forEach((_, i) => {
    answers[i].style.pointerEvents = "none";
  });
};

const timer = async () => {
  let time = 15;
  while (time >= 0) {
    if (stopTimer) return;
    await wait(1000);
    timerPlace.textContent = time;

    if (time === 0 && counter === allQuestions.length) {
      correctAnswersResult--;
      clickDisable();
      highlightCorrectAnswer();
      toResultPage();
      return;
    } 
    else if (time === 0) {
      correctAnswersResult--;
      clickDisable();
      highlightCorrectAnswer();
      await nextQuestion();
      await timer();
    }
    time--;
  }
};

buttonStart.addEventListener("click", async () => {
  buttonStart.style.pointerEvents = "none";
  await fetchQuestions(categoryURL, selectedDifficulty);
  await nextQuestion();
  container.style.backgroundImage = "none";
  buttonStart.style.display = "none";
  questionDiv.style.display = "block";
  timerPlace.style.display = "block";
  await timer(1000);
});

answersDiv.addEventListener("click", async (e) => {
  stopTimer = true;
  clickDisable();
  if (!correctAnswers.includes(e.target.value)) {
    correctAnswersResult--;
    highlightCorrectAnswer();
    e.target.style.backgroundColor = "red";
  } else {
    highlightCorrectAnswer();
  }
  if (counter === allQuestions.length) {
    toResultPage();
    return;
  }
  await nextQuestion();
  stopTimer = false;
  await timer();
});
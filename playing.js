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
let selectedCategory = localStorage.getItem("selectedCategory");
let allQuestions = [];
let correctAnswers = [];
let incorrectAnswers = [];
let allAnswers = [];
let correctAnswersResult = 5;
let counter = 0;
let categoryID = 0;
let shouldStop = false;
const categories = {
  Movies: "11",
  Music: "12",
  Geography: "22",
};

difficulty.textContent = selectedDifficulty.toUpperCase();
category.textContent = selectedCategory.toUpperCase();
questionDiv.style.display = "none";
answersDiv.style.pointerEvents = "none";
timerPlace.style.display = "none";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchQuestions = async (category, difficulty) => {
  try {
    let fetchQuestions = await fetch(
      `https://opentdb.com/api.php?amount=5&category=${category}&difficulty=${difficulty}&type=multiple`
    );
    let questionsObj = await fetchQuestions.json();

    questionsObj.results.forEach((e) => {
      allQuestions.push(e.question);
      correctAnswers.push(e.correct_answer);
      incorrectAnswers.push(e.incorrect_answers);
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

const questionHandling = async () => {
  await wait(1500);
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
  console.log("question");
};

const resultHandling = async () => {
  localStorage.setItem("endResult", correctAnswersResult);
  await wait(1500);
  window.location.href = "result.html";
};

const clickDisable = () => {
  allAnswers.forEach((_, i) => {
    answers[i].style.pointerEvents = "none";
  });
};

const timer = async () => {
  let time = 10;
  while (time >= 0) {
    if (shouldStop) return;
    await wait(1000);
    timerPlace.textContent = time;

    if (time === 0 && counter === allQuestions.length) {
      correctAnswersResult--;

      clickDisable();
      highlightCorrectAnswer();
      resultHandling();
      return;
    } else if (time === 0) {
      correctAnswersResult--;
      clickDisable();
      highlightCorrectAnswer();
      await questionHandling();
      await timer();
    }
    time--;
  }
};

buttonStart.addEventListener("click", async () => {
  buttonStart.style.pointerEvents = "none";

  categoryID = categories[selectedCategory];

  await fetchQuestions(categoryID, selectedDifficulty);
  await questionHandling();

  buttonStart.style.display = "none";
  questionDiv.style.display = "block";
  timerPlace.style.display = "block";
  container.style.backgroundImage = "none";

  await timer();
});

answersDiv.addEventListener("click", async (e) => {
  shouldStop = true;
  clickDisable();
  if (!correctAnswers.includes(e.target.value)) {
    correctAnswersResult--;
    highlightCorrectAnswer();
    e.target.style.backgroundColor = "red";
  } else {
    highlightCorrectAnswer();
  }

  if (counter === allQuestions.length) {
    resultHandling();
    return;
  }
  await questionHandling();
  shouldStop = false;
  await timer();
});

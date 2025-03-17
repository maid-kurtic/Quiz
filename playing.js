let difficulty = document.querySelector('#difficulty');
let category = document.querySelector('#category');
let answersDiv = document.querySelector('#answers');
let buttonStart = document.querySelector('button');
let answers = document.querySelectorAll('.answer');
let question = document.querySelector('#question');
let timerPlace = document.querySelector('#timer')
let questionDiv = document.querySelector('#question-div')
let container = document.querySelector('#container')
let selectedDifficulty = localStorage.getItem('selectedDifficulty')
let selectedCategory = localStorage.getItem('selectedCategory')
let allQuestions = [];
let correctAnswers = [];
let incorrectAnswers = [];
let allAnswers = []
let correctAnswersResult = 5;
let counter = 0;
let categoryID = 0;
let timerInner = 0;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
difficulty.textContent = selectedDifficulty.toUpperCase()
category.textContent = selectedCategory.toUpperCase()
questionDiv.style.display = 'none'
answersDiv.style.pointerEvents = 'none'
timerPlace.style.display = 'none'

const fetchQuestions = async (category, difficulty) => {

    try {
        let fetchQuestions = await fetch(`https://opentdb.com/api.php?amount=5&category=${category}&difficulty=${difficulty}&type=multiple`)
        let questionsObj = await fetchQuestions.json()

        questionsObj.results.forEach(e => {
            allQuestions.push(e.question)
            correctAnswers.push(e.correct_answer)
            incorrectAnswers.push(e.incorrect_answers)
        })

        return { allQuestions, correctAnswers, incorrectAnswers }
    }

    catch (err) {
        alert(err.message)
    }
}

const questionHandling = async () => {
    await wait(1000)
    question.textContent = allQuestions[counter];
    allAnswers = [correctAnswers[counter], ...incorrectAnswers[counter]];
    allAnswers.sort(() => Math.random() - 0.5);
    allAnswers.forEach((e, i) => {
        answers[i].value = e;
        answers[i].textContent = e;
        answers[i].style.backgroundColor = '#007bff'
        answers[i].style.pointerEvents = 'auto'
    })
    counter++;
}

const timer =  () => {
    let time = 5;
    timerInner = setInterval(() => {
        time--;
        if (time === 0) {
            clearInterval(timerInner);
            if (counter === allQuestions.length - 1) {
                correctAnswersResult--
                localStorage.setItem('endResult', correctAnswersResult);
                window.location.href = 'result.html';
            }
            else {
                questionHandling(counter)
                correctAnswersResult--
                timer()
            }
        }
        timerPlace.textContent = time;
    }, 1000)
}

buttonStart.addEventListener('click', async () => {

    if (selectedCategory === 'movies') {
        categoryID = 11;
    }
    else if (selectedCategory === 'music') {
        categoryID = 12;
    }
    else {
        categoryID = 22;
    }

    const { allQuestions, correctAnswers, incorrectAnswers } = await fetchQuestions(categoryID, selectedDifficulty)

    await questionHandling()

    buttonStart.style.display = 'none'
    questionDiv.style.display = 'block'
    timerPlace.style.display = 'block'
    container.style.backgroundImage = 'none'

    timer()
})

answersDiv.addEventListener('click', async (e) => {
    allAnswers.forEach((e, i) => {
        answers[i].style.pointerEvents = 'none'
    })

    clearInterval(timerInner)
    if (!correctAnswers.includes(e.target.value)) {
        correctAnswersResult--
        e.target.style.backgroundColor = 'red'

    }
    else {
        e.target.style.backgroundColor = 'green'
    }

    if (counter === allQuestions.length - 1) {
        await wait(1000)
        localStorage.setItem('endResult', correctAnswersResult);
        window.location.href = 'result.html';


    } else if (counter < allQuestions.length - 1) {
        await questionHandling()
        timer();
    }
})
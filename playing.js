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
let shouldStop = false;

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

const highlightCorrectAnswer = () => {
    answers.forEach((e, i) => {
        if (correctAnswers.includes(e.value)) {
            answers[i].style.backgroundColor = 'green';
        }
    })
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
    });
   counter++;
  
}

const clickDisable = () => {
    allAnswers.forEach((e, i) => {
        answers[i].style.pointerEvents = 'none'
    })
}

const timer = async () => {
    
    for (let i = 5; i >= 0; i--) {
        if (shouldStop) return;

        await wait(1000);
        timerPlace.textContent = i;

        if (i === 0 && counter === allQuestions.length - 1) {
           
            clickDisable()
            highlightCorrectAnswer()          
            correctAnswersResult--;
            localStorage.setItem('endResult', correctAnswersResult);
            window.location.href = 'result.html';
            
        }
        else if (i === 0) {
            correctAnswersResult--
            clickDisable()
            highlightCorrectAnswer()
            await questionHandling()
            await timer()
            
        }
    }
}

buttonStart.addEventListener('click', async () => {
    buttonStart.style.pointerEvents = 'none'

    if (selectedCategory === 'movies') {
        categoryID = 11;
    }
    else if (selectedCategory === 'music') {
        categoryID = 12;
    }
    else {
        categoryID = 22;
    }

    await fetchQuestions(categoryID, selectedDifficulty)
    await questionHandling()

    buttonStart.style.display = 'none'
    questionDiv.style.display = 'block'
    timerPlace.style.display = 'block'
    container.style.backgroundImage = 'none'

    await timer()

})

answersDiv.addEventListener('click', async (e) => {
    shouldStop = true;
    clickDisable();
    if (!correctAnswers.includes(e.target.value)) {
        correctAnswersResult--
        highlightCorrectAnswer()
        e.target.style.backgroundColor = 'red'
    }

    else {
        highlightCorrectAnswer()       
    }

    if (counter === allQuestions.length) {
        localStorage.setItem('endResult', correctAnswersResult)
        await wait(1300)
        window.location.href = 'result.html'
    }
    await questionHandling()
    shouldStop = false;   
    await timer()  
})
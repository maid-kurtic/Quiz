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
let index = 0;
let categoryID = 0;
let timerInner = 0;

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

const questionHandling = () => { 

    setTimeout(() => {
    index++;   
    question.textContent = allQuestions[index];
    
    allAnswers = [correctAnswers[index], ...incorrectAnswers[index]];
    allAnswers.sort(() => Math.random() - 0.5);
    allAnswers.forEach((e, i) => {       
        answers[i].value = e;
        answers[i].textContent = e; 
        answers[i].style.backgroundColor = '#007bff'
        answers[i].style.pointerEvents = 'auto'
    });   
},1000)
}

const timer = () => {
    let time = 11;
    timerInner = setInterval(() => {
        time--;
        if (time === 0) {
            clearInterval(timerInner);
            if (index === allQuestions.length - 1) {
                correctAnswersResult--
                localStorage.setItem('endResult', correctAnswersResult);
                window.location.href = 'result.html';
            }
            else {
                questionHandling()
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

    allAnswers = [correctAnswers[0], ...incorrectAnswers[0]]
    question.textContent = allQuestions[0];
    allAnswers.sort(() => Math.random() - 0.5);    
    allAnswers.forEach((e, i) => {
        answers[i].value = e
        answers[i].style.pointerEvents = 'auto'
    })

    buttonStart.style.display = 'none'
    questionDiv.style.display = 'block'
    timerPlace.style.display = 'block'
    container.style.backgroundImage = 'none'

    timer()
})

answersDiv.addEventListener('click', (e) => {
    allAnswers.forEach((e, i) => {
        answers[i].style.pointerEvents = 'none'
    })
    
    clearInterval(timerInner)
    if (!correctAnswers.includes(e.target.value) ) {
        correctAnswersResult--
        e.target.style.backgroundColor = 'red'

    }
    else {
        e.target.style.backgroundColor = 'green'

    }

    if (index === allQuestions.length - 1) {

        setTimeout(() => {
        localStorage.setItem('endResult', correctAnswersResult);
        window.location.href = 'result.html';
    }, 1000)

    } else if (index < allQuestions.length -1) {
        questionHandling()

        timer();
    }
})
let resultP = document.querySelector('#resultShow')
let buttonNewGame = document.querySelector('#newGame')
let correct = localStorage.getItem('endResult')

window.addEventListener('load', () => {
    resultP.textContent = correct;
})

buttonNewGame.addEventListener('click', () => {
    window.location.href = 'index.html'
})
let button = document.querySelector('#play');
let form = document.querySelector('form');
let radioDiv = document.querySelectorAll('.radio-div')
let inputs = document.querySelectorAll('input')
localStorage.clear()

window.addEventListener('pageshow', () => {
    inputs.forEach(e => {
        e.checked = false;
    })
})

radioDiv.forEach(e => {
    e.addEventListener('click', (event) => {
        if (event.target.name === 'category') {
            let label = event.target.previousElementSibling; 
            localStorage.setItem('selectedCategory', label.textContent);
        }
        else if (event.target.name === 'difficulty') {
            localStorage.setItem('selectedDifficulty', event.target.id)         
        }
    })
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
})

button.addEventListener('click', () => {
    
    if(localStorage.getItem('selectedDifficulty') == null || localStorage.getItem('selectedCategory') == null) {
        alert('Choose a category and level')
    }
    else {
    window.location.href = 'playing.html'
    }
})
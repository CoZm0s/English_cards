document.addEventListener('DOMContentLoaded', (event) => {
    const createCardButton = document.getElementById('createCardButton');
    const clearStorageButton = document.getElementById('clearStorageButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    createCardButton.addEventListener('click', createCard);
    clearStorageButton.addEventListener('click', clearLocalStorage);
    prevButton.addEventListener('click', scrollLeft);
    nextButton.addEventListener('click', scrollRight);

    loadCardsFromLocalStorage();
});

let currentCardIndex = 0;

function createCard() {
    const firstWordInput = document.getElementById('firstWordInput');
    const secondWordInput = document.getElementById('secondWordInput');
    const firstWord = firstWordInput.value.trim();
    const secondWord = secondWordInput.value.trim();

    if (firstWord && secondWord) {
        addCardToDOM(firstWord, secondWord);
        saveCardToLocalStorage(firstWord, secondWord);

        firstWordInput.value = '';
        secondWordInput.value = '';
        firstWordInput.focus();
    } else {
        console.error('Both word inputs must be filled');
    }
}

function addCardToDOM(firstWord, secondWord) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    const card = document.createElement('div');
    card.className = 'card';
    card.innerText = firstWord;
    card.dataset.firstWord = firstWord;
    card.dataset.secondWord = secondWord;

    card.addEventListener('click', () => {
        if (card.innerText === card.dataset.firstWord) {
            card.innerText = card.dataset.secondWord;
        } else {
            card.innerText = card.dataset.firstWord;
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => {
        deleteCardFromLocalStorage(firstWord, secondWord);
        cardContainer.remove();
        updateCardDisplay();
    });

    cardContainer.appendChild(card);
    cardContainer.appendChild(deleteButton);

    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.appendChild(cardContainer);
    updateCardDisplay();
}

function saveCardToLocalStorage(firstWord, secondWord) {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.push({ firstWord, secondWord });
    localStorage.setItem('cards', JSON.stringify(cards));
}

function loadCardsFromLocalStorage() {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.forEach(cardData => addCardToDOM(cardData.firstWord, cardData.secondWord));
    updateCardDisplay();
}

function deleteCardFromLocalStorage(firstWord, secondWord) {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards = cards.filter(card => card.firstWord !== firstWord || card.secondWord !== secondWord);
    localStorage.setItem('cards', JSON.stringify(cards));
}

function clearLocalStorage() {
    localStorage.removeItem('cards');
    document.getElementById('cardsContainer').innerHTML = '';
    currentCardIndex = 0;
    updateCardDisplay();
}

function scrollLeft() {
    const cards = document.querySelectorAll('.card-container');
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateCardDisplay();
    }
}

function scrollRight() {
    const cards = document.querySelectorAll('.card-container');
    if (currentCardIndex < cards.length - 1) {
        currentCardIndex++;
        updateCardDisplay();
    }
}

function updateCardDisplay() {
    const cards = document.querySelectorAll('.card-container');
    cards.forEach((card, index) => {
        if (index === currentCardIndex) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

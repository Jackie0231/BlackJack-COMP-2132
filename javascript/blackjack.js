$(document).ready(function() {
    const startButton = $('#start-button');
    const hitButton = $('#hit-button');
    const standButton = $('#stand-button');

    let userScore = 0;
    let dealerScore = 0;
    let computerScore = 0;
    const userCards = [];
    const dealerCards = [];
    const computerCards = [];
    const cardImagePath = '../card-images/';

    startButton.on('click', startGame);
    hitButton.on('click', hitCard);
    standButton.on('click', stand);

    function startGame() {
        console.log('Starting game...');
        resetGame();
        dealInitialCards();
        updateScores();
        startButton.hide();
        hitButton.show();
        standButton.show();
    }

    function resetGame() {
        console.log('Resetting game...');
        userScore = 0;
        dealerScore = 0;
        computerScore = 0;
        userCards.length = 0;
        dealerCards.length = 0;
        computerCards.length = 0;
        updateUI();
        $('.action').html(''); // Clear action history
    }

    function dealInitialCards() {
        console.log('Dealing initial cards...');
        userCards.push(drawCard());
        dealerCards.push(drawCard());
        computerCards.push(drawCard());
        updateUI();
    }

    function drawCard() {
        const cardValues = [
            { value: 2, name: '2' }, { value: 3, name: '3' }, { value: 4, name: '4' }, { value: 5, name: '5' }, 
            { value: 6, name: '6' }, { value: 7, name: '7' }, { value: 8, name: '8' }, { value: 9, name: '9' }, 
            { value: 10, name: '10' }, { value: 10, name: 'jack' }, { value: 10, name: 'queen' }, 
            { value: 10, name: 'king' }, { value: 11, name: 'ace' }
        ];
        const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        const randomValue = cardValues[Math.floor(Math.random() * cardValues.length)];
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        const cardName = `${randomValue.name}_of_${randomSuit}`;
        return { value: randomValue.value, name: cardName };
    }

    function updateScores() {
        userScore = calculateScore(userCards);
        dealerScore = calculateScore(dealerCards);
        computerScore = calculateScore(computerCards);
        console.log(`Scores updated - User: ${userScore}, Dealer: ${dealerScore}, Computer: ${computerScore}`);
        updateUI();
    }

    function calculateScore(cards) {
        let score = cards.reduce((acc, card) => acc + card.value, 0);
        let aceCount = cards.filter(card => card.value === 11).length;

        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }
        return score;
    }

    function updateUI() {
        console.log('Updating UI...');
        updateCardsUI('#user', userCards, userScore);
        updateCardsUI('#dealer', dealerCards, dealerScore);
        updateCardsUI('#computer', computerCards, computerScore);

        $('#user .score').text(`Score: ${userScore}`);
        $('#dealer .score').text(`Score: ${dealerScore}`);
        $('#computer .score').text(`Score: ${computerScore}`);
    }

    function updateCardsUI(playerId, cards, score) {
        const cardsContainer = $(`${playerId} .cards`);
        cardsContainer.empty();
        if (cards.length > 0) {
            const lastCard = cards[cards.length - 1];
            const cardImage = `${cardImagePath}${lastCard.name}.svg`;
            const img = $(`<img src="${cardImage}" alt="${lastCard.name}">`);
            img.on('error', function() {
                $(this).attr('src', `${cardImagePath}back.svg`);
            });
            cardsContainer.append(img);
        }
        updateActionHistory(playerId, cards, score);
    }

    function updateActionHistory(playerId, cards, score) {
        const actionContainer = $(`${playerId} .action`);
        actionContainer.html(''); // Clear previous actions
        if (cards.length > 0) {
            const actionList = cards.map(card => card.value).join(' + ');
            actionContainer.append(`<div>${actionList} = ${score}</div>`);
        }
    }

    function hitCard() {
        console.log('User hits...');
        userCards.push(drawCard());
        updateScores();
        if (userScore >= 21) {
            checkForWinner();
        }
    }

    function stand() {
        console.log('User stands...');
        dealerTurn();
        computerTurn();
        checkForWinner();
    }

    function dealerTurn() {
        console.log('Dealer turn...');
        while (dealerScore < 17) {
            dealerCards.push(drawCard());
            updateScores();
        }
    }

    function computerTurn() {
        console.log('Computer turn...');
        while (computerScore <= 10) {
            computerCards.push(drawCard());
            updateScores();
        }
    }

    function checkForWinner() {
        console.log('Checking for winner...');
        if (userScore > 21) {
            showResult('Dealer wins! You have bad luck.');
        } else if (dealerScore > 21) {
            showResult('User wins! You are very lucky. <a href="go-to-casino.html"><button>Go to real casino</button></a>');
        } else if (computerScore > 21) {
            showResult('Computer wins! The user has really bad luck.');
        } else if (userScore === 21) {
            showResult('User wins! You are very lucky. <a href="go-to-casino.html"><button>Go to real casino</button></a>');
        } else if (dealerScore === 21) {
            showResult('Dealer wins! You have bad luck.');
        } else if (computerScore === 21) {
            showResult('Computer wins! The user has really bad luck.');
        } else if (dealerScore >= 17 && computerScore > 10) {
            if (userScore > dealerScore && userScore > computerScore) {
                showResult('User wins! You are very lucky. <a href="go-to-casino.html"><button>Go to real casino</button></a>');
            } else if (dealerScore >= 17 && dealerScore > userScore && dealerScore > computerScore) {
                showResult('Dealer wins! You have bad luck.');
            } else if (computerScore > userScore && computerScore > dealerScore) {
                showResult('Computer wins! The user has really bad luck.');
            } else if (dealerScore >= 17 && dealerScore === userScore && dealerScore > computerScore) {
                showResult('It\'s a tie between dealer and user! No one wins.');
            } else if (computerScore === userScore && computerScore > dealerScore) {
                showResult('It\'s a tie between computer and user! No one wins.');
            } else if (dealerScore === computerScore && dealerScore > userScore) {
                showResult('It\'s a tie between dealer and computer! No one wins.');
            } else {
                showResult('It\'s a tie! No one wins.');
            }
        }
    }

    function showResult(message) {
        const result = $('<div>').addClass('result-popup').html(`<p>${message}</p><button>Play Again</button>`);
        $('body').append(result);
        result.find('button').on('click', function() {
            result.fadeOut(500, function() {
                result.remove();
                location.reload();
            });
        });
        hitButton.hide();
        standButton.hide();
    }
});

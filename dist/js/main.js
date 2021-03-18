
// Coded by Gerardo Ortiz
// Last updated: 03-16-2021


'use strict'


const data = {
    cpu: {
        score: 50,
        lastRandomNumber: '',
        isFrozen: false,
        activePlayer: false
    },
    player1: {
        score: 50,
        lastRandomNumber: '',
        isFrozen: false,
        activePlayer: false
    },
    activePlayer: function() {
        if (this.cpu.activePlayer === true) return 'CPU';
        if (this.player1.activePlayer === true) return 'Player 1';
        return 'No current active players. The game has not started yet.';
    },
    lastRandomColor: ''
}


// SELECTORS


const createCPUUnits = document.querySelector('.cpu-units');
const createPlayerOneUnits = document.querySelector('.player-1-units');
let cpuUnits = '';
let playerOneUnits = '';
const playButton = document.querySelector('.play-button');
const modal = document.querySelector('.modal');
const headsTailsModal = document.querySelector('.modal__heads-or-tails');
const modalMessage = document.querySelector('.modal__text--bold');
const panel = document.querySelectorAll('.active-player-panel');
const playerName = document.querySelectorAll('.player-name');
const cardNumber = document.querySelector('.card-number');
const cardNumberInner = document.querySelector('.card-number__number');
const atkButton = document.querySelector('.atk');
const endTurnButton = document.querySelector('.end-turn');
const playerBarHitPoints = document.querySelectorAll('.player-bar__hit-points');
const playerUnitsRemainingText = document.querySelectorAll('.player-units__units');
const activityLog = document.querySelector('.card__activity');
const battleModal = document.querySelector('.modal-battle');
const winnerModal = document.querySelector('.modal-winning-message');
const winnerModalText = winnerModal.querySelector('.modal-winning-message__text');
const newGameButton = winnerModal.querySelector('.new-game-button');
let headsTailsModalBackup = '';
let currentTurn = 0;


// EVENT LISTENERS


// Starts the game
playButton.addEventListener('click', startGame); 
cardNumber.addEventListener('click', revealNumber);
newGameButton.addEventListener('click', resetGame);


// FUNCTIONS


// Creates the units
createUnits();





function getActivePlayer() {
    return data.activePlayer();
}





function startGame() {
    playButton.classList.add('scaled');
    modal.classList.remove('hidden');
    modal.classList.add('visible');
    flipCoin();
    disableBtns();
}





function resetGame() {
    // hide the winner modal
    winnerModal.classList.add('hidden');

    // reset players scores
    data.cpu.score = 50;
    data.player1.score = 50;

    // reset last random number for each player
    data.cpu.lastRandomNumber = '';
    data.player1.lastRandomNumber = '';

    // reset frozen status
    data.cpu.isFrozen = false;
    data.player1.isFrozen = false;

    // reset activePlayer status
    data.cpu.activePlayer = false;
    data.player1.activePlayer = false;

    // reset units
    for (let i = 0; i < 50; i++) {
        cpuUnits[i].classList.remove('unit-depleted', 'unit-depleted-frozen', 'frozen');
        playerOneUnits[i].classList.remove('unit-depleted', 'unit-depleted-frozen', 'frozen');
    }

    // reset health bar
    let classesToRemove = [];
    for (let i = 0; i < playerBarHitPoints.length; i++) {
        for (let classItem = 1; classItem < playerBarHitPoints[i].classList.length; classItem++) {
            classesToRemove.push(playerBarHitPoints[i].classList[classItem]);
        }
        playerBarHitPoints[i].classList.remove(...classesToRemove);
        playerBarHitPoints[i].removeAttribute('style');
        playerBarHitPoints[i].classList.add('hp-green');
        classesToRemove = [];
    }

    // reset player units text
    for (let i = 0; i < playerUnitsRemainingText.length; i++) {
        playerUnitsRemainingText[i].textContent = '50/50';
    }

    // reset the active player panel
    for (let i = 0; i < panel.length; i++) {
        if (panel[i].classList.contains('opacity-100')) {
            panel[i].classList.remove('opacity-100');
        }
    }

    // reset the player name opacity
    for (let i = 0; i < playerName.length; i++) {
        if (playerName[i].classList.contains('opacity-24')) playerName[i].classList.remove('opacity-24');
    }

    // reset activity log
    // 
    const log = activityLog.querySelectorAll('.card__text');
    for (let i = 0; i < log.length; i++) {
        if (i === 0) log[i].textContent = 'No activity yet.';
        else log[i].remove();
    }

    // reset the heads or tails modal
    modal.classList.add('hidden');
    modal.appendChild(headsTailsModalBackup);
    modal.classList.remove('transition-delay');
    modalMessage.innerHTML = 'Heads or tails?';

    // reset the card
    resetCardNumber();

    // reset the last random color 
    data.lastRandomColor = '';

    // hide the atk and end turn buttons
    hideAtkEndTurnButtons();

    // reset the number of turns from previous game
    currentTurn = 0;

    // starts the game again
    startGame();
}

function createUnits() {

    create(createCPUUnits);
    create(createPlayerOneUnits);

    function create(playerUnits) {
        for (let i = 0; i < 50; i++) {
            const unit = document.createElement('div');
            unit.classList.add('unit');
            unit.classList.add(`unit-${i + 1}`);
            playerUnits.appendChild(unit);
        }
    }

    cpuUnits = createCPUUnits.querySelectorAll('.unit');
    playerOneUnits = createPlayerOneUnits.querySelectorAll('.unit');
}


function flipCoin() {
    const coin = document.querySelectorAll('.heads-or-tails__coin');
    const randomNumber = Math.floor((Math.random() * 2) + 0);
    headsTailsModalBackup = headsTailsModal;

    for (let i = 0; i < coin.length; i++) {
        coin[i].addEventListener('click', function() {
            headsTailsModal.remove();

            if (randomNumber === 1) {
                data.player1.activePlayer = true;
                modalMessage.innerHTML = 'You are going first!';
                editActivityLog('Player 1 is going first! CPU is going second!');
            } else {
                data.cpu.activePlayer = true;
                modalMessage.innerHTML = 'You are going second!';
                editActivityLog('CPU is going first! Player 1 is going second!');
            }

            modal.classList.remove('visible');
            modal.classList.add('transition-delay');

            beginPhase();
        }, { once: true });
    }
}





function beginPhase() {
    const activePlayer = getActivePlayer();

    if (currentTurn === 0) {
        setTimeoutforXSeconds(enableBattleModal, 1800);
        setTimeoutforXSeconds(setActivePanel, 1800);
        setTimeoutforXSeconds(setActiveName, 1800);
    }

    if (activePlayer === 'CPU') {
        cardNumber.removeEventListener('click', revealNumber);
        cardNumber.classList.remove('cursor-en');
        cardNumberInner.innerHTML = '. . .';
        cpuAutoBattle();
    } else {
        cardNumber.addEventListener('click', revealNumber);
        cardNumber.classList.add('cursor-en');
        atkButton.addEventListener('click', attackUnits);
        endTurnButton.addEventListener('click', endTurn);
    }
}





function cpuAutoBattle() {
    if (currentTurn === 0) {
        initialTurn();
    } else {
        setTimeoutforXSeconds(revealNumber, 1000);
        setTimeoutforXSeconds(normalTurn, 1000);
    }

    function initialTurn() {
        setTimeoutforXSeconds(revealNumber, 3000);
        setTimeoutforXSeconds(attackUnits, 4000);
        setTimeoutforXSeconds(endTurn, 5000); 
    }

    function normalTurn() {
        if (data.lastRandomColor === 'not-purple') {
            setTimeoutforXSeconds(endTurn, 1000);
        } else {
            setTimeoutforXSeconds(attackUnits, 1000);
            setTimeoutforXSeconds(endTurn, 2000);
        }
    }
}





function setActivePlayer() {
    const activePlayer = getActivePlayer();
    if (activePlayer === 'CPU') {
        data.player1.activePlayer = true;
        data.cpu.activePlayer = false;
    } else {
        data.cpu.activePlayer = true;
        data.player1.activePlayer = false;
    }
}





function setActivePanel() {
    const activePlayer = getActivePlayer();
    if (activePlayer === 'CPU') {
        panel[1].classList.remove('opacity-100');
        panel[0].classList.add('opacity-100');
    } else {
        panel[0].classList.remove('opacity-100');
        panel[1].classList.add('opacity-100');
    }
}





function setActiveName() {
    const activePlayer = getActivePlayer();
    if (activePlayer === 'CPU') {
        playerName[0].classList.remove('opacity-24');
        playerName[1].classList.add('opacity-24');
    } else {
        playerName[1].classList.remove('opacity-24');
        playerName[0].classList.add('opacity-24');
    }
}





function setTimeoutforXSeconds(parameter, seconds) {
    setTimeout(parameter, seconds);
}





function enableBattleModal() {
    battleModal.classList.remove('hidden');
    battleModal.classList.add('visible');
}





function resetCardNumber() {
    const activePlayer = getActivePlayer();
    cardNumberInner.classList.remove('revealed-number');
    activePlayer === 'CPU' ? cardNumberInner.innerHTML = '. . .' : cardNumberInner.innerHTML = 'Reveal Number';
    cardNumber.classList.remove(data.lastRandomColor);
    cardNumber.classList.remove('pointer-events-disabled');
}





function disableBtns() {
    atkButton.classList.add('pointer-events-disabled');
    endTurnButton.classList.add('pointer-events-disabled');
}





function activateAtkEndTurnButtons() {
    const activePlayer = getActivePlayer();
    const frozen = isPlayerFrozen();

    if (activePlayer !== 'CPU') {
        atkButton.classList.add('visible');
        endTurnButton.classList.add('visible');
    }

    if (frozen) {
        if (data.lastRandomColor === 'not-purple' && activePlayer !== 'CPU') {
            atkButton.classList.add('disabled');
            enableEndTurnButton();
        } else if (data.lastRandomColor === 'purple' && activePlayer !== 'CPU') {
            atkButton.classList.remove('pointer-events-disabled');
            endTurnButton.classList.add('disabled');
        }
    } else if (activePlayer !== 'CPU') {
        atkButton.classList.remove('pointer-events-disabled');
        endTurnButton.classList.add('disabled');
    }
}





function attackUnits() {
    // reduce opponent's units
    editPlayerScore();
    targetPlayerUnits();
    
    // change health bar to reflect available units
    modifyHealthBar();

    // edits the text that shows the units remaining (i.e. 50/50)
    modifyRemainingPlayerUnitsText();

    // disable atk button
    const activePlayer = getActivePlayer();
    if (activePlayer !== 'CPU') atkButton.classList.add('disabled', 'pointer-events-disabled');

    // freezes the player
    freezePlayer();

    // enables the end turn button
    if (activePlayer !== 'CPU') enableEndTurnButton();

    declareWinner();
}





function endTurn() {
    const activePlayer = getActivePlayer();
    hideAtkEndTurnButtons();

    atkButton.classList.add('pointer-events-disabled');
    endTurnButton.classList.add('pointer-events-disabled');

    // this will remove the frozen status of the current player, if frozen
    unfreezePlayer();

    // changes the active player
    setActivePlayer();

    // this will reset the card 
    resetCardNumber();

    // changes the player panel and the player name to the active player
    setActivePanel();
    setActiveName();
    
    // const activePlayer = getActivePlayer();
    editActivityLog(`${activePlayer} has ended their turn.`);

    // cpuAutoBattle();
    // if (activePlayer === 'CPU') {
    //     cpuAutoBattle();
    // }
    beginPhase();
}





function enableEndTurnButton() {
    endTurnButton.classList.remove('disabled');
    endTurnButton.classList.remove('pointer-events-disabled');
}





function hideAtkEndTurnButtons() {
    atkButton.classList.remove('disabled');
    atkButton.classList.remove('visible');
    endTurnButton.classList.remove('visible');
}
 




function revealNumber() {
    currentTurn++;
    editActivityLog(`Turn ${currentTurn}`);
    const activePlayer = getActivePlayer();
    const randomColor = `${getRandomColor()}`;

    cardNumberInner.classList.add('revealed-number');
    cardNumberInner.innerHTML = getRandomNumber();

    cardNumber.classList.add(randomColor);
    cardNumber.classList.add('pointer-events-disabled');

    // updates the last number the player received, which updates the data object 
    const number = parseInt(cardNumberInner.innerHTML);
    
    if (activePlayer === 'CPU') {
        data.cpu.lastRandomNumber = number;
    } else {
        data.player1.lastRandomNumber = number;
    }

    if (randomColor === 'not-purple') {
        editActivityLog(`${activePlayer} received a card with the number ${number}.`);
        editActivityLog(`${activePlayer} is unable to attack.`);
    } else {
        editActivityLog(`${activePlayer} received a ${randomColor} card with the number ${number}.`);
    }

    activateAtkEndTurnButtons();
}





function getRandomNumber() {
    // Math.floor(Math.random() * (max - min + 1)) + min
    // return Math.floor(Math.random() * (4 - 1 + 1)) + 1;
    return Math.floor((Math.random() * 4) + 1);
}





function getRandomColor() {
    let colors = ['black', 'yellow', 'cyan'];
    let randomColor;
    const frozen = isPlayerFrozen();

    if (frozen) {
        colors = ['not-purple', 'purple'];
        randomColor = colors[Math.floor((Math.random() * 2) + 0)];
    } else {
        randomColor = colors[Math.floor((Math.random() * 3) + 0)];
    }
    data.lastRandomColor = randomColor;
    return randomColor;
}





function editPlayerScore() {
    const activePlayer = getActivePlayer();
    // if color is yellow, double attack
    const doubleAtk = data.lastRandomColor === 'yellow' ? true : false;

    if (activePlayer === 'CPU') {
        if (doubleAtk === true) {
            data.player1.score -= (data.cpu.lastRandomNumber * 2);
        } else {
            data.player1.score -= data.cpu.lastRandomNumber;
        }
            // this checks to see if the score is less than 0. If it is, then the score will 0.
        if (data.player1.score < 0) {
            data.player1.score = 0;
        }
    } else {
        if (doubleAtk === true) {
            data.cpu.score -= (data.player1.lastRandomNumber * 2);
        } else {
            data.cpu.score -= data.player1.lastRandomNumber;
        }
        // this checks to see if the score is less than 0. If it is, then the score will 0.
        if (data.cpu.score < 0) {
            data.cpu.score = 0;
        }
    }
}





function targetPlayerUnits() {
    const activePlayer = getActivePlayer();
    let unitsDepleted = 0;

    if (activePlayer === 'CPU') {
        targetUnits(playerOneUnits, data.cpu);
    } else {
        targetUnits(cpuUnits, data.player1);
    }

    function targetUnits(playerUnits, player) {
        // let unitsDepleted = 0;
        for (let i = 0; i < 50; i++) {

            if (playerUnits[i].classList.contains('unit-depleted')) {
                continue;
            } else if (unitsDepleted === player.lastRandomNumber && data.lastRandomColor !== 'yellow') {
                break;
            } else if (unitsDepleted === (player.lastRandomNumber * 2) && data.lastRandomColor === 'yellow') {
                break;
            } else {
                playerUnits[i].classList.add('unit-depleted');
                unitsDepleted++;
            }
        }
    }
    editActivityLog(`${activePlayer} attacked opponent. Opponent lost ${unitsDepleted} unit(s).`);
}





function modifyHealthBar() {
    const playerBar = document.querySelectorAll('.player-bar');
    const barWidth = playerBar[0].offsetWidth;
    const cpuBarHitPoints = playerBarHitPoints[0];
    const playerOneBarHitPoints = playerBarHitPoints[1];

    data.activePlayer() === 'CPU' ? targetActive(playerOneBarHitPoints, data.player1.score) : targetActive(cpuBarHitPoints, data.cpu.score);

    function targetActive(playerHitPoints, playerScore) {
        if (!playerHitPoints.classList.contains('border-radius-edit')) {
            playerHitPoints.classList.add('border-radius-edit');
        }
        // note: 1 unit equals to 6.4px in this case since the bar width is 320
        playerHitPoints.style.width = `${(barWidth / 50) * (playerScore)}px`;
    }

    changeHealthBarColor();

    function changeHealthBarColor() {
        let currentBGColor = '';

        playerBarHitPoints.forEach(bar => {
            if (bar.classList.contains('hp-green')) {
                currentBGColor = 'green';
            } else if (bar.classList.contains('hp-yellow')) {
                currentBGColor = 'yellow';
            } else {
                currentBGColor = 'red';
            }

            if (bar.offsetWidth <= (barWidth * 0.50) && bar.offsetWidth > (barWidth * 0.20)) {
                changeColor(bar, currentBGColor, 'hp-yellow');
            } else if (bar.offsetWidth <= (barWidth * 0.20)) {
                changeColor(bar, currentBGColor, 'hp-red');
            } else {
                changeColor(bar, currentBGColor, 'hp-green');
            }
        });

        function changeColor(currentBar, currentColor, targetColor) {
            currentBar.classList.remove(`hp-${currentColor}`);
            currentBar.classList.add(targetColor);
        }
    }
}





function modifyRemainingPlayerUnitsText() {
    if (data.activePlayer() === 'CPU') {
        playerUnitsRemainingText[1].textContent = `${data.player1.score}/50`;
    } else {
        playerUnitsRemainingText[0].textContent = `${data.cpu.score}/50`;
    }
}





function freezePlayer() {
    const activePlayer = getActivePlayer();

    if (cardNumber.classList.contains('cyan')) {
        if (activePlayer === 'CPU') {
            freezeUnits(playerOneUnits);
            freezeHealthBar(playerBarHitPoints[1]);
            setBooleanFrozenStatus(activePlayer);
        } else {
            freezeUnits(cpuUnits);
            freezeHealthBar(playerBarHitPoints[0]);
            setBooleanFrozenStatus(activePlayer);
        }
        editActivityLog(`Opponent is now frozen.`);
    }

    function freezeUnits(playerUnits) {
        playerUnits.forEach(unit => {
            if (unit.classList.contains('unit-depleted')) {
                unit.classList.add('unit-depleted-frozen');
            } else {
                unit.classList.add('frozen');
            }
        });
    }

    function freezeHealthBar(bar) {
        if (activePlayer === 'CPU') {
            const bgColor = playerBarHitPoints[0].style.backgroundColor;
            playerBarHitPoints[1].classList.add('frozen');
        } else {
            playerBarHitPoints[0].classList.add('frozen');
        }
    }

    function setBooleanFrozenStatus(player) {
        if (activePlayer === 'CPU') {
            data.player1.isFrozen = true;
        } else {
            data.cpu.isFrozen = true;
        }
    }
}





function unfreezePlayer() {
    const activePlayer = getActivePlayer();
    const targetUnits = activePlayer === 'CPU' ? cpuUnits : playerOneUnits;

    if (data.lastRandomColor === 'purple' || data.lastRandomColor === 'not-purple') {
        // 
        unfreezeUnits(targetUnits);
        unfreezeHealthBar();
        data.cpu.isFrozen = false;
        data.player1.isFrozen = false;
        editActivityLog(`${activePlayer} is no longer frozen.`);
    }

    function unfreezeUnits(playerUnits) {
        playerUnits.forEach(unit => {
            if (unit.classList.contains('unit-depleted-frozen') || unit.classList.contains('frozen')) {
                unit.classList.remove('unit-depleted-frozen');
                unit.classList.remove('frozen');
            }
        });
    }

    function unfreezeHealthBar() {
        playerBarHitPoints.forEach(bar => {
            if (bar.classList.contains('frozen')) {
                bar.classList.remove('frozen');
            }
        });
    }
}





function isPlayerFrozen() {
    return data.cpu.isFrozen === true || data.player1.isFrozen === true ? true : false;
}





function editActivityLog(message) {
    // edits the activity log
    const defaultText = document.querySelectorAll('.card__text');
    const element = document.createElement('p');
    if (defaultText[1].textContent === 'No activity yet.') activityLog.removeChild(defaultText[1]);
    element.classList.add('card__text');
    element.textContent = message;

    if (element.textContent === `Turn ${currentTurn}`) element.classList.add('c-turn');

    activityLog.appendChild(element);
    activityLog.scrollTop = activityLog.scrollHeight;
}





function declareWinner() {
    const cpuScore = data.cpu.score;
    const playerOneScore = data.player1.score;

    if (cpuScore === 0) message('You Won!');
    if (playerOneScore === 0) message('You Lost!');

    function message(text) {
        winnerModalText.textContent = text;
        battleModal.classList.add('hidden');
        battleModal.classList.remove('visible');
        winnerModal.classList.remove('hidden');
        editActivityLog(cpuScore === 0 ? 'Player 1 has won the game.' : 'CPU has won the game.');
    }
}





(function disableUserSelection() {
    const body = document.getElementsByTagName('BODY') [0];
    body.style.userSelect = 'none';
})();

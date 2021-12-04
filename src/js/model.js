import { STARTER_UNITS } from './config';

export const state = {
    cpu: {
        score: STARTER_UNITS,
        isActivePlayer: false,
        isFrozen: false
    },
    player1: {
        score: STARTER_UNITS,
        isActivePlayer: false,
        isFrozen: false
    },
    atkBtn: {
        disabled: true
    },
    endTurnBtn: {
        disabled: true
    },
    lastNumber: null,
    lastRandomColor: null,
    turn: 1,
    get activePlayer() { return this.cpu.isActivePlayer ? 'cpu' : 'player1'; },
    get opponent() { return this.cpu.isActivePlayer ? 'player1' : 'cpu'; }
};

export const flipCoin = function() {
    const randomNumber = Math.floor((Math.random() * 2) + 0);
    if (randomNumber) state.player1.isActivePlayer = true;
    else state.cpu.isActivePlayer = true;
    return randomNumber;
};

export const getRandomNumber = function() {
    const randNum = Math.floor((Math.random() * 4) + 1);
    state.lastNumber = randNum;
    return randNum;
};

export const generateRandomColor = function() {
    let colors = ['black', 'yellow', 'cyan'];
    let randomColor;

    if (state[state.activePlayer].isFrozen) {
        colors = [null, 'purple'];
        randomColor = colors[Math.floor((Math.random() * 2) + 0)];
    }
    else {
        randomColor = colors[Math.floor((Math.random() * 3) + 0)];
    }

    state.lastRandomColor = randomColor;
    return randomColor;
};

export const toggleAtkEndTurnBtns = function() {
    if (state.lastRandomColor === 'purple' || state.lastRandomColor) {
        state.atkBtn.disabled = true;
        state.endTurnBtn.disabled = false;
    } else {
        state.atkBtn.disabled = false;
        state.endTurnBtn.disabled = true;
    }

    return { atkBtn: state.atkBtn, endTurnBtn: state.endTurnBtn };
};

export const editScore = function() {
    let num = state.lastNumber * (state.lastRandomColor === 'yellow' ? 2 : 1);
    // Save last score
    state[state.opponent].lastScore = state[state.opponent].score;
    state[state.opponent].score -= num;
    if (state[state.opponent].score <= 0) state[state.opponent].score = 0;

    return state[state.opponent].score;
};

export const freezePlayer = function() {
    const value = state.lastRandomColor === 'cyan' ? state[state.opponent].isFrozen = true : state[state.opponent].isFrozen = false;
    return { player: state.opponent, isFrozen: value };
};

export const unfreezePlayer = function() {
    state[state.activePlayer].isFrozen = false;
    return { player: state.activePlayer, defrost: true };
};

export const switchActivePlayer = function() {
    const cpu = state.cpu;
    const player = state.player1;
    [cpu.isActivePlayer, player.isActivePlayer] = [player.isActivePlayer, cpu.isActivePlayer];
};

export const percentage = function() {
    return { totalScore: STARTER_UNITS, score: state[state.opponent].score, player: state.opponent };
};

export const getData = function() {
    return { unitsToDeplete:  STARTER_UNITS - state[state.opponent].score, player: state.opponent};
}

export const winner = function() {
    if (!state.cpu.score) return 'You Won 🏆';
    if (!state.player1.score) return 'You Lost';
};

export const activityMessage = function(str) {
    const activePlayer = state.activePlayer === 'cpu' ? 'CPU' : 'Player 1';
    const opponent = state.opponent === 'cpu' ? 'CPU' : 'Player 1';
    let units = state.lastRandomColor === 'yellow' ? state.lastNumber * 2 : state.lastNumber;
    const turn = `Turn ${state.turn}`;
    let msg;

    // Need this statement to show the correct number of units that were depleted if the player won the game.
    if (state[state.opponent].score === 0) units = state[state.opponent].lastScore;

    if (str === 'Start Game') {
        msg = `${turn}: ${activePlayer} is going first. ${opponent} is going second.`;
    }

    if (str === 'Start Phase') {
        msg = `${turn}: ${activePlayer} has received a ${state.lastRandomColor || 'gray'} card with the number ${state.lastNumber}.`;
    }

    if (str === 'Attack Phase') {
        const verb = units > 1 ? 'were' : 'was';
        msg = `${turn}: ${activePlayer} has attacked ${opponent}. ${units} ${units > 1 ? 'units' : 'unit'} ${verb} depleted.`;
    }

    if (str === 'End Phase') {
        msg = `${turn}: ${activePlayer} has ended their turn.`;
        state.turn++;
    }

    if (str === 'Winner') {
        msg = `${turn}: ${activePlayer} has won the game! 🏆`;
    }

    return msg;
};

export const resetData = function() {
    // Resets player data
    [state.cpu, state.player1].forEach(player => {
        player.score = STARTER_UNITS,
        player.isActivePlayer = false,
        player.isFrozen = false
    });
    state.lastNumber = null,
    state.lastRandomColor = null,
    state.turn = 1
};

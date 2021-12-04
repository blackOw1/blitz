import * as model from './model';
import { STARTER_UNITS } from './config';
import view from './views/View';
import zoneView from './views/zoneView';
import unitsView from './views/unitsView';
import healthBarView from './views/healthBarView';
import activityView from './views/activityView';
import { timeout } from './helpers';

// Parcel-related
if (module.hot) module.hot.accept(() => { location.reload(); });

const controlStartGame = async function() {
    // Flip coin
    zoneView._displayMessage(model.flipCoin());

    // Hide message
    await timeout(zoneView._hideMessage.bind(zoneView), 2);
    
    // Render active player panel
    view._activatePanel(model.state.activePlayer);

    // Render current player box
    view._renderCurrentPlayerBox(model.state.activePlayer);

    // Generate battle modal
    zoneView._generateBattleModal();

    // Edit activity log
    activityView._renderActivity(model.activityMessage('Start Game'));

    // If the current player is CPU
    controlCpu(model.state.activePlayer);
};

const controlInitBattlePhase = function() {
    // Render number
    zoneView.renderNumber(model.getRandomNumber());

    // Render color
    zoneView.renderColor(model.generateRandomColor());

    // Start battle phase
    if (model.state.activePlayer === 'player1') zoneView._toggleBattlePhase(model.toggleAtkEndTurnBtns());

    // Edit activity log
    activityView._renderActivity(model.activityMessage('Start Phase'));
};

const controlAtk = function() {
    // Edit score
    model.editScore();

    // Deplete units
    unitsView._deductUnits(model.getData());

    // Freeze player, if applicable
    unitsView._renderFrozenState(model.freezePlayer());
    healthBarView._renderFrozenState(model.freezePlayer());

    // Edit health bar and percentage
    healthBarView._render(model.percentage());

    // Edit activity log
    activityView._renderActivity(model.activityMessage('Attack Phase'));

    if (model.state.activePlayer === 'player1') {
        // Check if the player has won
        if (controlWinner()) return;

        // Disable atk btn
        zoneView._disableBtn('atk');

        // Enable end btn
        zoneView._enableBtn('end-turn');
    }
};

const controlEndTurn = function() {
    // Reset 
    zoneView._reset();

    // Unfreeze player, if applicable
    unitsView._renderDefrostState(model.unfreezePlayer());
    healthBarView._renderDefrostState(model.unfreezePlayer());

    // Edit activity log
    activityView._renderActivity(model.activityMessage('End Phase'));

    // Switch active player
    model.switchActivePlayer();

    // Generate battle modal
    zoneView._generateBattleModal();

    // Render active player panel
    view._resetPanel();
    view._activatePanel(model.state.activePlayer);

    // Render current player box
    view._updateCurrentPlayerBox(model.state.activePlayer);

    if (model.state.activePlayer === 'cpu') controlCpu(model.state.activePlayer);
};

const controlWinner = function() {
    if (zoneView._renderWinnerMarkup(model.winner())) {
        activityView._renderActivity(model.activityMessage('Winner'));
        return true;
    }
}

const controlReset = function() {
    // Reset state data
    model.resetData();

    // Reset units
    unitsView._reset(STARTER_UNITS);

    // Reset health bars
    healthBarView._reset();

    // Reset activity
    activityView._reset();
    activityView._renderDefault();

    // Reset zone
    zoneView._reset();
    zoneView._renderPlayButton();

    // Remove active player panel
    view._resetPanel();

    // Remove current player box
    view._resetCurrentPlayerBox();
};

const controlCpu = async function(player) {
    if (player === 'cpu') {
        zoneView._resetCard();

        for (let i = 0; i < 4; i++) {
            i === 3 ? await timeout(_ => _, 0.5) : await timeout(zoneView._renderDot.bind(zoneView), 0.5);
        }

        zoneView._resetCard();
        await timeout(controlInitBattlePhase, 0);

        if (model.state.lastRandomColor) await timeout(controlAtk, 1);
        if (controlWinner()) return;

        await timeout(controlEndTurn, 1);
    }
};

const init = function() {
    console.log(`Last access: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    // controlUnits();
    unitsView._generateUnits(STARTER_UNITS);
    zoneView.addHandlerStartBtn(controlStartGame);
    zoneView.addHandlerClick(controlInitBattlePhase);
    zoneView._addHandlerAtkPhase(controlAtk);
    zoneView._addHandlerEndPhase(controlEndTurn);
    zoneView.addHandlerPlayAgain(controlReset);
};

init();
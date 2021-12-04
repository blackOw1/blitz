class View {
    _parentElement = document.querySelector('body');

    _resetPanel(player) {
        this._parentElement.querySelector('.player-panel').remove();
    }

    _resetCurrentPlayerBox() {
        this._parentElement.querySelector('.current-player-box').remove();
        // const existingBox = document.querySelector('.current-player-box');
        // if (existingBox) existingBox.remove();
    }

    _activatePanel(player) {
        let markup;

        if (player === 'cpu') {
            markup = this._renderMarkup(player);
        } else {
            markup = this._renderMarkup(player);
        }

        this._parentElement.insertAdjacentHTML('beforeend', markup);
    }

    _renderMarkup(player) {
        return `<div class="player-panel player-${player} player-panel--active"></div>`;
    }

    _renderCurrentPlayerBox(player) {
        const markup = `
            <div class="current-player-box">
                <p class="current-player-box__text">Current player: <span class="highlight">${player === 'cpu' ? 'CPU' : 'Player 1'}</span></p>
            </div>
        `;
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    _updateCurrentPlayerBox(player) {
        this._parentElement.querySelector('.current-player-box__text').querySelector('.highlight').innerText = player === 'cpu' ? 'CPU' : 'Player 1';
    }
}

export default new View();
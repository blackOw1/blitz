import { timeout } from "../helpers";

class ZoneView {
    _parentElement = document.querySelector('.zone');

    _reset() {
        this._parentElement.innerHTML = '';
    }

    _resetCard() {
        this._parentElement.querySelector('.card-number').innerHTML = '';
        this._parentElement.querySelector('.card-number').classList.add('disabled-interaction');
    }
    
    _renderPlayButton() {
        const markup = `<button class="button play-button">Play</button>`;
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.card-number');
            if (!btn) return;
            if (btn.classList.contains('revealed')) return;
            handler();
        });
    }

    _generateBattleModal() {
        const markup = `
            <div class="modal-battle">

                <div class="card-number def-color concealed">
                    <span class="card-number__number">Reveal <br> Number</span>
                </div>

            </div>
        `;
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    _toggleBattlePhase(obj) {
        const battleModal = this._parentElement.querySelector('.modal-battle');
        const markupAtkBtn = this._renderAtkBtnMarkup(obj.atkBtn.disabled);
        const markupEndTurnBtn = this._renderEndTurnMarkup(obj.endTurnBtn.disabled);

        battleModal.insertAdjacentHTML('afterbegin', markupAtkBtn);
        battleModal.insertAdjacentHTML('beforeend', markupEndTurnBtn);
    }

    _addHandlerAtkPhase(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.atk');
            if (!btn) return;
            handler();
        });
    }

    _addHandlerEndPhase(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.end-turn');
            if (!btn) return;
            handler();
        });
    }

    addHandlerStartBtn(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.play-button');
            if (!btn) return;

            btn.classList.toggle('hidden');
            handler();
        });
    }

    addHandlerPlayAgain(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.play-again-button');
            if (!btn) return;
            handler();
        });
    }

    _displayMessage(num) {
        const msg = num ? 'You are going first' : 'You are going second';
        
        const markup = `
        <div class="message">
        <p class="message__text">${msg}</p>
        </div>
        `;
        
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    _hideMessage() {
        const msgElement = this._parentElement.querySelector('.message');
        msgElement.classList.toggle('hidden');
    }

    renderNumber(num) {
        if (!this._parentElement.querySelector('.card-number__number')) this._renderCardNumber();
        const text = this._parentElement.querySelector('.card-number__number');
        text.innerText = num;
        
        // Format the font
        this.formatFont(this._parentElement.querySelector('.card-number'));
    }

    renderColor(color) {
        const card = this._parentElement.querySelector('.card-number');
        card.classList.remove('def-color');
        card.classList.add(color);
    }

    _renderCardNumber() {
        const markup = `<span class="card-number__number">Reveal <br> Number</span>`;
        this._parentElement.querySelector('.card-number').insertAdjacentHTML('afterbegin', markup);
    }

    _renderAtkBtnMarkup(render) {
        return `
            <div class="atk btn-${render ? 'enabled' : 'disabled'}" data-state="disabled">
                <span class="atk__text">ATK</span>
            </div>
        `;
    }

    _renderEndTurnMarkup(render) {
        return `
            <div class="end-turn btn-${render ? 'enabled' : 'disabled'}" data-state="disabled">
                <span class="end-turn__text">END</span>
            </div>
        `;
    }

    _renderWinnerMarkup(msg) {
        if (!msg) return;
        this._reset();
        const markup = `
            <div class="winning-message">
                <p class="winning-message__text">${msg}</p>
                <button class="button play-again-button">Play again</button>
            </div>
        `;

        this._parentElement.insertAdjacentHTML('afterbegin', markup);
        return true;
    }

    _disableBtn(selector) {
        const btn = this._parentElement.querySelector(`.${selector}`);
        btn.classList.remove('btn-enabled');
        btn.classList.add('btn-disabled');
    }

    _enableBtn(selector) {
        const btn = this._parentElement.querySelector(`.${selector}`);
        btn.classList.add('btn-enabled');
        btn.classList.remove('btn-disabled');
    }

    formatFont(el) {
        el.classList.toggle('concealed');
        el.classList.toggle('revealed');
    }

    _renderCpuPhase() {
        const card = this._parentElement.querySelector('.card-number');
        
        // Render processing animation 
        this._renderProcessingAnimation(card);
        
        // Disable user interaction
        card.classList.add('disabled-interaction');

        return;
    }

    async _renderProcessingAnimation(el) {
        const dots = ['.', '.', '.'];
        el.innerHTML = '';

        for (let i = 0; i < dots.length; i++) {
            const markup = `<span class="card-number__number large">${dots[i]}</span>`;
            await timeout(function() { el.insertAdjacentHTML('beforeend', markup); }, 0.5);
        }
    }

    _renderDot() {
        const dot = '.';
        const markup = `<span class="card-number__number large">${dot}</span>`;
        this._parentElement.querySelector('.card-number').insertAdjacentHTML('beforeend', markup);
    }
}

export default new ZoneView();
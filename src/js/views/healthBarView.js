class HealthBarView {
    _parentElement = document.querySelectorAll('.player-health-container');
    _parentElementCpu = this._parentElement[0];
    _parentElementPlayer1 = this._parentElement[1];
    _defaultColor = 'hb-green';

    _reset() {
        this._parentElement.forEach(el => {
            const hb = el.querySelector('.player-bar');
            const markup = `<div class="player-bar__hit-points hb-green"></div>`;
            hb.innerHTML = markup;
            hb.nextElementSibling.innerText = `100%`;
        });
    }

    _render(data) {
        const { totalScore, score, player } = data;
        const barWidth = this._parentElementCpu.querySelector('.player-bar').getBoundingClientRect().width;
        const percentage = score / totalScore;
        let hitPointsBar;

        if (player === 'cpu') {
            hitPointsBar = this._parentElementCpu.querySelector('.player-bar__hit-points');
        } else {
            hitPointsBar = this._parentElementPlayer1.querySelector('.player-bar__hit-points');
        }

        hitPointsBar.style.width = `${percentage * barWidth}px`;

        // Change color
        if (percentage <= 0.50 && percentage > 0.20) {
            hitPointsBar.classList.remove('hb-green');
            hitPointsBar.classList.add('hb-yellow');
        }
        if (percentage <= 0.20) {
            hitPointsBar.classList.remove('hb-green');
            hitPointsBar.classList.add('hb-red');
        }

        // Edit percentage
        this._renderPercentage(percentage, hitPointsBar);
    }

    _renderFrozenState(data) {
        const { player, isFrozen } = data;
        if (!isFrozen) return;

        let hitPointsBar;

        if (player === 'cpu') {
            hitPointsBar = this._parentElementCpu.querySelector('.player-bar__hit-points');
        } else {
            hitPointsBar = hitPointsBar = this._parentElementPlayer1.querySelector('.player-bar__hit-points');
        }

        hitPointsBar.classList.remove('hb-green');
        hitPointsBar.classList.add('frozen');
    }

    _renderDefrostState(data) {
        const { player, defrost } = data;
        let hitPointsBar;

        if (defrost) {
            if (player === 'cpu') {
                hitPointsBar = this._parentElementCpu.querySelector('.player-bar__hit-points');
            } else {
                hitPointsBar = this._parentElementPlayer1.querySelector('.player-bar__hit-points');
            }
            
            hitPointsBar.classList.remove('frozen');
            hitPointsBar.classList.add('hb-green');
        }
    }

    _renderPercentage(percentage, target) {
        const int = Math.trunc(percentage * 100);
        target.parentElement.nextElementSibling.innerText = `${int}%`;
    }
}

export default new HealthBarView();
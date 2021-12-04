class UnitsView {
    // _parentElement = document.querySelectorAll('.units');
    _parentElementCpu = document.querySelector('.cpu-units');
    _parentElementPlayer1 = document.querySelector('.player-1-units');

    // _reset(player) {
    //     this._parentElement.forEach(el => {
    //         if (el.classList.contains(`units-${player}`)) {
    //             el.innerHTML = '';
    //         }
    //     });
    // }

    _reset(units) {
        const playerUnits = [this._parentElementCpu, this._parentElementPlayer1];
        playerUnits.forEach(unit => {
            unit.innerHTML = '';
        });

        this._generateUnits(units);
    }

    _generateUnits(units) {
        const playerUnits = [this._parentElementCpu, this._parentElementPlayer1];

        playerUnits.forEach(unit => {
            for (let i = 0; i < units; i++) {
                const el = document.createElement('div');
                el.classList.add('unit');
                el.classList.add('unit-active');
                unit.appendChild(el);
            }
        });
    }

    _deductUnits(data) {
        const { unitsToDeplete, player } = data;
        let depleted = 1;
        const units = player === 'cpu' ? this._parentElementCpu : this._parentElementPlayer1;

        for (const unit of units.querySelectorAll('.unit')) {
            if (depleted > unitsToDeplete) break;
            unit.classList.remove('unit-active');
            unit.classList.add('unit-depleted');
            depleted++;
        }
    }

    _renderFrozenState(data) {
        const { player, isFrozen } = data;
        if (!isFrozen) return;

        let units;

        if (player === 'cpu') {
            units = this._parentElementCpu.querySelectorAll('.unit');
        } else {
            units = this._parentElementPlayer1.querySelectorAll('.unit');
        }

        units.forEach(unit => {
            if (unit.classList.contains('unit-depleted')) {
                unit.classList.add('unit-frozen-d');
            }
            if (unit.classList.contains('unit-active')) {
                unit.classList.remove('unit-active');
                unit.classList.add('unit-frozen');
            }
        });
    }

    _renderDefrostState(data) {
        const { player, defrost } = data;
        let units;

        if (defrost) {
            if (player === 'cpu') {
                units = this._parentElementCpu.querySelectorAll('.unit');
            } else {
                units = this._parentElementPlayer1.querySelectorAll('.unit');
            }
    
            units.forEach(unit => {
                if (unit.classList.contains('unit-depleted')) {
                    unit.classList.remove('unit-frozen-d');
                }
                if (unit.classList.contains('unit-frozen')) {
                    unit.classList.remove('unit-frozen');
                    unit.classList.add('unit-active');
                }
            });
        }
    }
}

export default new UnitsView();
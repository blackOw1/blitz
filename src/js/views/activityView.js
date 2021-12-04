class ActivityView {
    _parentElement = document.querySelector('.card__activity');

    _reset() {
        this._parentElement.innerHTML = '';
    }

    _renderDefault() {
        const markup = `<p class="card__text">No activity yet.</p>`;
        this._parentElement.insertAdjacentHTML('afterbegin' , markup);
    }

    _renderActivity(message) {
        if (this._parentElement.innerText.includes('No activity yet')) this._parentElement.innerHTML = '';

        const markup = `<p class="card__text">${message}</p>`;
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}

export default new ActivityView();
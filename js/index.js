const initActionButtons = () => {
    let elements = document.getElementsByClassName("action-button");
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", (e) => {
            const href = e.target.dataset.href;
            window.location = href;
        });
    }
}

(function() {
    initActionButtons();
})();
(function () {
    const list = document.getElementById('passion-sports-list');
    const stage = document.getElementById('passion-sports-stage');
    if (!list || !stage) return;

    const items = list.querySelectorAll('[data-sport]');
    const anims = stage.querySelectorAll('[data-sport]');

    function show(sport) {
        items.forEach(function (li) {
            li.classList.toggle('is-selected', li.dataset.sport === sport);
        });
        anims.forEach(function (el) {
            const active = el.dataset.sport === sport;
            el.hidden = !active;
            el.classList.toggle('is-active', active);
        });
    }

    items.forEach(function (li) {
        var sport = li.dataset.sport;
        li.addEventListener('mouseenter', function () { show(sport); });
        li.addEventListener('focus', function () { show(sport); });
        li.addEventListener('click', function () { show(sport); });
    });

    show('tennis');
})();

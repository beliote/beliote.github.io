(function () {
    const root = document.getElementById('passions-carousel');
    if (!root) return;

    const viewport = root.querySelector('.passions-carousel-viewport');
    const slides = Array.from(root.querySelectorAll('.passions-carousel-slide'));
    const pagination = root.querySelector('.passions-carousel-pagination');
    const isFF = typeof InstallTrigger !== 'undefined';

    const n = slides.length;
    const state = {
        pos: 0,
        gap: 24,
        dragging: false,
        sideTap: null,
        pointerId: null,
        x0: 0,
        pos0: 0,
        v: 0,
        t0: 0,
        animating: false,
        animFrame: 0
    };

    const opts = {
        gap: 24,
        rotateY: 28,
        zDepth: 120,
        scaleDrop: 0.07,
        blurMax: 1.2,
        sideInset: 28,
        transitionMs: 850,
        breakpoints: [
            { mq: '(max-width: 768px)', gap: 16, rotateY: 18, zDepth: 70, scaleDrop: 0.06, sideInset: 20 },
            { mq: '(max-width: 560px)', gap: 12, rotateY: 12, zDepth: 50, scaleDrop: 0.05, sideInset: 16 }
        ]
    };

    if (isFF) {
        opts.rotateY = 8;
        opts.zDepth = 0;
        opts.blurMax = 0;
    }

    let slideW = 800;
    let dots = [];

    function mod(i) {
        return (i % n + n) % n;
    }

    function activeIndex() {
        return mod(Math.round(state.pos), n);
    }

    function wrapDelta(from, to) {
        let d = to - from;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        return d;
    }

    function setupDots() {
        pagination.innerHTML = '';
        dots = slides.map(function (_, i) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'passions-carousel-dot';
            btn.setAttribute('aria-label', 'Passion card ' + (i + 1));
            btn.addEventListener('click', function () { goToIndex(i); });
            pagination.appendChild(btn);
            return btn;
        });
    }

    function measure() {
        const viewRect = viewport.getBoundingClientRect();
        slideW = Math.max(280, Math.floor(viewRect.width - opts.sideInset * 2));
        root.style.setProperty('--passions-slide-w', slideW + 'px');
        state.gap = opts.gap;
    }

    function slideTransform(tx, depth, rot, scale) {
        const cx = -slideW / 2 + tx;
        if (isFF) {
            return 'translate(' + cx + 'px,-50%) scale(' + scale + ')';
        }
        return 'translate3d(' + cx + 'px,-50%,' + depth + 'px) rotateY(' + rot + 'deg) scale(' + scale + ')';
    }

    function render() {
        const span = slideW + state.gap;

        for (let i = 0; i < n; i++) {
            let d = i - state.pos;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;

            const tx = d * span;
            const depth = -Math.abs(d) * opts.zDepth;
            const rot = -d * opts.rotateY;
            const scale = 1 - Math.min(Math.abs(d) * opts.scaleDrop, 0.35);
            const blur = Math.min(Math.abs(d) * opts.blurMax, opts.blurMax);
            const z = Math.round(1000 - Math.abs(d) * 10);
            const slide = slides[i];

            slide.style.transform = slideTransform(tx, depth, rot, scale);
            slide.style.filter = !isFF && blur > 0.05 ? 'blur(' + blur + 'px)' : 'none';
            slide.style.zIndex = String(z);

            const absD = Math.abs(d);
            if (absD < 0.15) {
                slide.dataset.state = 'active';
                slide.dataset.side = 'center';
            } else {
                slide.dataset.state = 'rest';
                slide.dataset.side = d < 0 ? 'left' : 'right';
            }
        }

        const active = activeIndex();
        dots.forEach(function (dot, i) {
            dot.setAttribute('aria-selected', i === active ? 'true' : 'false');
        });

        if (window.__puzzleResize) window.__puzzleResize();
    }

    function animateTo(end, animate) {
        if (animate === undefined) animate = true;

        if (state.animFrame) {
            cancelAnimationFrame(state.animFrame);
            state.animFrame = 0;
        }

        const start = state.pos;
        const dur = animate ? opts.transitionMs : 0;
        const t0 = performance.now();
        const ease = function (x) { return 1 - Math.pow(1 - x, 4); };

        state.animating = true;

        function step(now) {
            const t = dur ? Math.min(1, (now - t0) / dur) : 1;
            const p = dur ? ease(t) : 1;
            state.pos = start + (end - start) * p;
            render();
            if (t < 1) {
                state.animFrame = requestAnimationFrame(step);
            } else {
                state.pos = end;
                state.animating = false;
                state.animFrame = 0;
                render();
            }
        }

        state.animFrame = requestAnimationFrame(step);
    }

    function goToRelative(dir) {
        animateTo(Math.round(state.pos) + dir);
    }

    function goToIndex(i) {
        const rounded = Math.round(state.pos);
        const cur = mod(rounded, n);
        const delta = wrapDelta(cur, i);
        animateTo(rounded + delta);
    }

    function isInteractiveTarget(el) {
        return el && el.closest && el.closest('a, button, input, textarea, select, #puzzle-board, .puzzle-board-wrap, .passion-sports-list, .passion-sports-stage, .passion-travel-map');
    }

    function onPointerDown(e) {
        if (isInteractiveTarget(e.target)) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        const slide = e.target.closest('.passions-carousel-slide');
        const side = slide && slide.dataset.side;

        if (side === 'left' || side === 'right') {
            state.sideTap = side;
            state.x0 = e.clientX;
            state.pointerId = e.pointerId;
            return;
        }

        e.preventDefault();
        state.dragging = true;
        state.pointerId = e.pointerId;
        viewport.setPointerCapture(e.pointerId);
        state.x0 = e.clientX;
        state.pos0 = state.pos;
        state.t0 = performance.now();
        state.v = 0;
    }

    function onPointerMove(e) {
        if (state.sideTap && e.pointerId === state.pointerId) {
            if (Math.abs(e.clientX - state.x0) > 8) state.sideTap = null;
            return;
        }

        if (!state.dragging || e.pointerId !== state.pointerId) return;

        const dx = e.clientX - state.x0;
        const dt = Math.max(16, performance.now() - state.t0);
        state.v = dx / dt;
        state.pos = state.pos0 - dx / (slideW + state.gap);
        render();
    }

    function onPointerUp(e) {
        if (state.sideTap && (!e || e.pointerId === state.pointerId)) {
            const side = state.sideTap;
            state.sideTap = null;
            state.pointerId = null;
            goToRelative(side === 'left' ? -1 : 1);
            return;
        }

        if (!state.dragging || (e && e.pointerId !== state.pointerId)) return;

        state.dragging = false;
        try {
            if (state.pointerId != null) viewport.releasePointerCapture(state.pointerId);
        } catch (_) {}
        state.pointerId = null;

        const dx = Math.abs(e.clientX - state.x0);
        if (dx < 8) {
            animateTo(Math.round(state.pos0));
            return;
        }

        const v = state.v;
        const threshold = 0.18;
        const target = Math.round(state.pos - Math.sign(v) * (Math.abs(v) > threshold ? 0.5 : 0));
        animateTo(target);
    }

    function bind() {
        root.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') goToRelative(-1);
            if (e.key === 'ArrowRight') goToRelative(1);
        });

        viewport.addEventListener('pointerdown', onPointerDown);
        viewport.addEventListener('pointermove', onPointerMove);
        viewport.addEventListener('pointerup', onPointerUp);
        viewport.addEventListener('pointercancel', onPointerUp);

        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(function () {
                measure();
                render();
            }).observe(viewport);
        }

        opts.breakpoints.forEach(function (bp) {
            const m = window.matchMedia(bp.mq);
            const apply = function () {
                if (!m.matches) return;
                Object.keys(bp).forEach(function (k) {
                    if (k !== 'mq') opts[k] = bp[k];
                });
                measure();
                render();
            };
            if (m.addEventListener) m.addEventListener('change', apply);
            else m.addListener(apply);
            if (m.matches) apply();
        });

        window.addEventListener('resize', function () {
            measure();
            render();
        });
    }

    setupDots();
    bind();
    measure();
    state.pos = 0;
    render();
})();

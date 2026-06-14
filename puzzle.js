(function ($) {
    const boardEl = document.getElementById('puzzle-board');
    const hintEl = document.getElementById('puzzle-hint');
    const PIECE_THEME = 'assets/vendor/chess/pieces/{piece}.png';

    function pieceSrc(piece) {
        return PIECE_THEME.replace('{piece}', piece);
    }

    function fail(msg) {
        if (hintEl) hintEl.textContent = msg;
    }

    if (!boardEl || !hintEl) return;
    if (!window.__PUZZLE__) { fail('Puzzle data missing.'); return; }
    if (typeof Chess === 'undefined' || typeof Chessboard === 'undefined') {
        fail('Board unavailable.');
        return;
    }

    const puzzle = window.__PUZZLE__;
    let game = new Chess(puzzle.fen);
    let board;
    let step = 0;
    let pendingPromo = null;
    let promotionEl = null;
    const playerColor = puzzle.fen.split(' ')[1];
    const defaultHint = (playerColor === 'w' ? 'White' : 'Black') +
        ' to play and <strong>win</strong>';

    function fenToPosition(fen) {
        const chess = new Chess(fen);
        const position = {};
        for (let i = 0; i < chess.SQUARES.length; i++) {
            const square = chess.SQUARES[i];
            const piece = chess.get(square);
            if (piece) {
                position[square] = (piece.color === 'w' ? 'w' : 'b') + piece.type.toUpperCase();
            }
        }
        return position;
    }

    function syncBoard() {
        if (!board) return;
        board.position(fenToPosition(game.fen()));
    }

    function toUci(move) {
        return move.from + move.to + (move.promotion || '');
    }

    function isPromotionSquare(target, piece) {
        if (!piece || piece.charAt(1).toLowerCase() !== 'P') return false;
        return piece.charAt(0) === 'w' ? target.charAt(1) === '8' : target.charAt(1) === '1';
    }

    function promotionForStep(stepIndex) {
        const uci = puzzle.solution[stepIndex];
        return uci && uci.length > 4 ? uci[4] : undefined;
    }

    function applyMove(source, target, promoChoice) {
        const expected = puzzle.solution[step];
        const opts = { from: source, to: target };
        const promo = promoChoice || promotionForStep(step);
        if (promo) opts.promotion = promo;

        const move = game.move(opts);
        if (!move) return null;

        if (toUci(move) !== expected) {
            game.undo();
            return null;
        }

        return move;
    }

    function setHint(html, state) {
        hintEl.innerHTML = html;
        hintEl.classList.remove('puzzle-hint-wrong', 'puzzle-hint-solved');
        if (state) hintEl.classList.add(state);
    }

    function hidePromotionDialog() {
        if (promotionEl) promotionEl.hidden = true;
    }

    function ensurePromotionUi() {
        if (promotionEl) return promotionEl;

        const wrap = boardEl.parentElement;
        if (!wrap) return null;

        promotionEl = document.createElement('div');
        promotionEl.id = 'puzzle-promotion';
        promotionEl.className = 'puzzle-promotion';
        promotionEl.hidden = true;
        promotionEl.innerHTML =
            '<p class="puzzle-promotion-label">Promote to</p>' +
            '<div class="puzzle-promotion-pieces"></div>';
        wrap.appendChild(promotionEl);
        return promotionEl;
    }

    function showPromotionDialog(color, onPick) {
        const el = ensurePromotionUi();
        if (!el) return;

        const pieces = el.querySelector('.puzzle-promotion-pieces');
        pieces.innerHTML = '';

        ['q', 'r', 'b', 'n'].forEach(function (type) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'puzzle-promotion-btn';
            btn.setAttribute('aria-label', type);

            const img = document.createElement('img');
            img.src = pieceSrc(color + type.toUpperCase());
            img.alt = type;
            btn.appendChild(img);

            btn.addEventListener('click', function () {
                hidePromotionDialog();
                onPick(type);
            });

            pieces.appendChild(btn);
        });

        el.hidden = false;
    }

    function afterPlayerMove() {
        syncBoard();
        step++;
        if (step < puzzle.solution.length) {
            setTimeout(playOpponent, 300);
        } else {
            setHint('Well done!', 'puzzle-hint-solved');
        }
    }

    function rejectMove() {
        setHint('Not the right move', 'puzzle-hint-wrong');
        setTimeout(function () { setHint(defaultHint); }, 1200);
    }

    function completePlayerMove(source, target, promoChoice) {
        if (!applyMove(source, target, promoChoice)) {
            rejectMove();
            return false;
        }
        afterPlayerMove();
        return true;
    }

    function playOpponent() {
        const uci = puzzle.solution[step];
        const move = { from: uci.slice(0, 2), to: uci.slice(2, 4) };
        if (uci.length > 4) move.promotion = uci[4];
        game.move(move);
        syncBoard();
        step++;
        if (step >= puzzle.solution.length) setHint('Well done!', 'puzzle-hint-solved');
    }

    function onDragStart(source, piece) {
        if (pendingPromo) return false;
        if (step % 2 !== 0 || step >= puzzle.solution.length) return false;
        if (game.turn() !== playerColor) return false;
        const isWhite = piece.charAt(0) === 'w';
        return game.turn() === 'w' ? isWhite : !isWhite;
    }

    function onDrop(source, target, piece) {
        if (isPromotionSquare(target, piece)) {
            pendingPromo = { source: source, target: target };
            showPromotionDialog(piece.charAt(0), function (promoType) {
                const pending = pendingPromo;
                pendingPromo = null;
                if (!pending) return;
                completePlayerMove(pending.source, pending.target, promoType);
            });
            return 'snapback';
        }

        if (!completePlayerMove(source, target)) {
            return 'snapback';
        }

        return undefined;
    }

    function onSnapEnd() {
        syncBoard();
    }

    function boardSize() {
        const wrap = boardEl.parentElement;
        if (!wrap) return 400;
        return wrap.clientWidth;
    }

    function applySize() {
        const size = boardSize();
        if (size < 50) return;
        boardEl.style.width = size + 'px';
        if (board) board.resize();
    }

    function mountBoard() {
        if (board) board.destroy();
        hidePromotionDialog();
        pendingPromo = null;

        board = Chessboard('puzzle-board', {
            position: fenToPosition(puzzle.fen),
            draggable: true,
            orientation: playerColor === 'w' ? 'white' : 'black',
            pieceTheme: pieceSrc,
            onDragStart: onDragStart,
            onDrop: onDrop,
            onSnapEnd: onSnapEnd
        });

        applySize();
        setHint(defaultHint);
    }

    window.__puzzleResize = applySize;

    $(function () {
        mountBoard();
        setTimeout(applySize, 50);
        setTimeout(applySize, 300);
    });

    $(window).on('resize', applySize);
})(window.jQuery);

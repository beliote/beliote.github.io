(function () {
    // Codes ISO ('fr', 'es', 'it', 'us')
    var VISITED = ['fr', 'es', 'pt', 'it', 'gb', 'be', 'nl', 'ad', 'de', 'at', 'dk', 'hr', 'is', 'fo','cz', 'me', 'gr', 'tr', 'se', 'fi', 'ee', 'ru', 'ma', 'ca', 'us', 'jp'];

    var WORLD_VIEW = [0, 0, 1010, 666];
    var ZOOM_MS = 500;

    var CONTINENT_CODES = {
        europe: 'ad al ax at ba be bg by ch cy cz de dk ee es fi fo fr gb gg gi gr hr hu ie im is it je li lt lu lv mc md me mk mt nl no pl pt ro rs se si sj sk sm ua va xk tr'.split(' '),
        africa: 'ao bf bi bj bw cd cf cg ci cm cv dj dz eg eh er et ga gh gm gn gq gw ke km lr ls ly ma mg ml mr mu mw mz na ne ng rw sc sd sl sn so ss st sz td tg tn tz ug za zm zw re yt sh'.split(' '),
        asia: 'ae af az bd bh bn bt cn ge hk id in ir iq il jo jp kg kh kp kr kw kz la lb lk mm mn mo my mv np om ph pk ps qa sa sg sy th tj tm tw uz vn ye am tl'.split(' '),
        'north-america': 'ca gl mx us bm bs bz cr cu dm do gt hn ht jm kn ni pa pr sv tt ai ag aw bb bl bq cw gd gp gy ky lc mf mq ms sx tc vg vi vc'.split(' '),
        'south-america': 'ar bo br cl co ec fk gf gy pe py sr uy ve'.split(' '),
        oceania: 'au cc ck cx fj fm gu ki mh mp nc nf nr nu nz pf pg pn sb tk to tv vu wf ws as pw'.split(' ')
    };

    var BBOX_EXCLUDE = { ru: 1, kz: 1, mn: 1, ca: 1, us: 1, cn: 1, br: 1, au: 1, gl: 1 };

    var CONTINENT_ZOOM = {
        africa: { pad: 0.08, shrink: 1 },
        asia: { pad: 0.08, shrink: 1 },
        'north-america': { pad: 0.08, shrink: 1 },
        'south-america': { pad: 0.08, shrink: 1 },
        oceania: { pad: 0.08, shrink: 1 }
    };

    var DEFAULT_ZOOM = { pad: 0.08, shrink: 1 };

    var fixedViews = {};

    var CODE_TO_CONTINENT = {};
    Object.keys(CONTINENT_CODES).forEach(function (name) {
        CONTINENT_CODES[name].forEach(function (code) {
            CODE_TO_CONTINENT[code] = name;
        });
    });

    var root = document.getElementById('passion-travel-map');
    if (!root) return;

    var activeContinent = null;
    var animFrame = 0;

    function parseViewBox(vb) {
        if (Array.isArray(vb)) return vb.slice();
        return vb.trim().split(/[\s,]+/).map(Number);
    }

    function formatViewBox(arr) {
        return arr.map(function (n) { return Math.round(n * 100) / 100; }).join(' ');
    }

    function computeEuropeView(svg) {
        var iceland = svg.querySelector('#is');
        var cyprus = svg.querySelector('#cy');
        if (!iceland || !cyprus) return null;

        var ib = iceland.getBBox();
        var cb = cyprus.getBBox();
        return [
            ib.x,
            ib.y,
            cb.x + cb.width - ib.x,
            cb.y + cb.height - ib.y
        ];
    }

    function getContinentViewBox(svg, continent, clickedCode) {
        if (fixedViews[continent]) return fixedViews[continent].slice();

        var tune = CONTINENT_ZOOM[continent] || DEFAULT_ZOOM;
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;

        svg.querySelectorAll('path[id]').forEach(function (path) {
            var code = path.id.toLowerCase();
            if (CODE_TO_CONTINENT[code] !== continent) return;
            if (BBOX_EXCLUDE[code] && code !== clickedCode) return;
            if (tune.exclude && tune.exclude[code] && code !== clickedCode) return;

            var box = path.getBBox();
            minX = Math.min(minX, box.x);
            minY = Math.min(minY, box.y);
            maxX = Math.max(maxX, box.x + box.width);
            maxY = Math.max(maxY, box.y + box.height);
        });

        if (!isFinite(minX)) return WORLD_VIEW.slice();

        var w = maxX - minX;
        var h = maxY - minY;
        var pad = Math.max(w, h) * (tune.pad != null ? tune.pad : DEFAULT_ZOOM.pad);
        var x = minX - pad;
        var y = minY - pad;
        w += pad * 2;
        h += pad * 2;

        var shrink = tune.shrink != null ? tune.shrink : 1;
        if (shrink !== 1) {
            var nw = w * shrink;
            var nh = h * shrink;
            var cx = x + w / 2;
            var cy = y + h / 2;
            x = cx - nw / 2;
            y = cy - nh / 2;
            w = nw;
            h = nh;
        }

        if (tune.maxW && w > tune.maxW) {
            x += (w - tune.maxW) / 2;
            w = tune.maxW;
        }
        if (tune.maxH && h > tune.maxH) {
            y += (h - tune.maxH) / 2;
            h = tune.maxH;
        }

        return [x, y, w, h];
    }

    function animateViewBox(svg, target) {
        if (animFrame) cancelAnimationFrame(animFrame);

        var from = parseViewBox(svg.getAttribute('viewBox') || formatViewBox(WORLD_VIEW));
        var to = parseViewBox(target);
        var t0 = performance.now();
        var ease = function (x) { return 1 - Math.pow(1 - x, 3); };

        function step(now) {
            var p = Math.min(1, (now - t0) / ZOOM_MS);
            var e = ease(p);
            var cur = [
                from[0] + (to[0] - from[0]) * e,
                from[1] + (to[1] - from[1]) * e,
                from[2] + (to[2] - from[2]) * e,
                from[3] + (to[3] - from[3]) * e
            ];
            svg.setAttribute('viewBox', formatViewBox(cur));
            if (p < 1) {
                animFrame = requestAnimationFrame(step);
            } else {
                animFrame = 0;
            }
        }

        animFrame = requestAnimationFrame(step);
    }

    function setZoomState(svg, continent) {
        activeContinent = continent;
        if (continent) {
            svg.classList.add('is-zoomed');
            root.classList.add('is-zoomed');
        } else {
            svg.classList.remove('is-zoomed');
            root.classList.remove('is-zoomed');
        }
    }

    function bindZoom(svg) {
        svg.querySelectorAll('path[id]').forEach(function (path) {
            path.addEventListener('click', function (e) {
                e.stopPropagation();

                var code = path.id.toLowerCase();
                var continent = CODE_TO_CONTINENT[code];
                if (!continent) return;

                if (activeContinent === continent) {
                    setZoomState(svg, null);
                    animateViewBox(svg, WORLD_VIEW);
                } else {
                    setZoomState(svg, continent);
                    animateViewBox(svg, getContinentViewBox(svg, continent, code));
                }
            });
        });
    }

    fetch('assets/travel/world.svg')
        .then(function (res) {
            if (!res.ok) throw new Error('map load failed');
            return res.text();
        })
        .then(function (svgText) {
            root.innerHTML = svgText;

            var map = root.querySelector('svg');
            if (!map) return;

            map.classList.add('passion-travel-svg');
            map.setAttribute('role', 'img');
            map.setAttribute('aria-label', 'World map — click a country to zoom on its continent, click again to zoom out');

            var visited = new Set(VISITED.map(function (code) {
                return String(code).toLowerCase();
            }));

            map.querySelectorAll('path[id]').forEach(function (path) {
                if (visited.has(path.id.toLowerCase())) {
                    path.classList.add('is-visited');
                }
            });

            fixedViews.europe = computeEuropeView(map);

            bindZoom(map);

            var countEl = document.getElementById('passion-travel-count');
            if (countEl) {
                if (visited.size === 0) {
                    countEl.textContent = '';
                } else {
                    countEl.textContent = visited.size + (visited.size === 1 ? ' country' : ' countries');
                }
            }
        })
        .catch(function () {
            root.innerHTML = '<p class="passion-travel-error">Map could not be loaded.</p>';
        });
})();

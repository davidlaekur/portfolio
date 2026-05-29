/* =========================================================
   Portfolio · Davidlaekur
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {


    /* ---------- Activar sección ---------- */
    const activateSection = (id) => {
        const target = document.getElementById(id);
        if (!target) return false;
        document.querySelectorAll('.section').forEach((s) => s.classList.remove('is-active'));
        document.querySelectorAll('.portfolio-nav a').forEach((l) => l.classList.remove('is-active'));
        target.classList.add('is-active');
        const nav = document.querySelector(`.portfolio-nav a[href="#${id}"]`);
        if (nav) nav.classList.add('is-active');
        document.getElementById('portfolio').scrollTo({ top: 0, behavior: 'smooth' });
        return true;
    };


    /* =====================================================
       HOMENAJE A GAUDÍ — Trencadís Casa Batlló
       La fachada de la Casa Batlló está cubierta de trencadís
       (mosaico de cerámica rota) en tonos del mar: azules,
       turquesas, verdes y destellos coral. Aquí recreamos esa
       superficie como una banda ondulada en la parte inferior,
       con teselas irregulares y un reflejo de luz que recorre
       el mosaico como el agua. El centro queda libre.
       ===================================================== */
    const initGaudi = () => {
        const canvas = document.getElementById('gaudi-canvas');
        const ctx = canvas.getContext('2d');

        // Trencadís Casa Batlló: gradiente real de su fachada.
        // Abajo (base): azules profundos del mar. Arriba (cresta):
        // tonos cálidos como las escamas del tejado-dragón.
        const coolColors = [    // zona inferior — mar
            [26, 110, 158],   // azul mar profundo
            [40, 140, 180],   // azul
            [40, 180, 175],   // turquesa
            [90, 200, 195],   // turquesa claro
            [120, 190, 130]   // verde clorofila
        ];
        const warmColors = [    // zona superior — tejado dragón
            [120, 190, 130],  // verde (transición)
            [232, 196, 90],   // amarillo sol
            [240, 165, 80],   // ámbar
            [214, 102, 64],   // terracota
            [206, 92, 110]    // rosa cerámica
        ];
        const pick = (depth) => {
            // depth 1 = abajo (frío), depth 0 = arriba (cálido)
            const pool = depth > 0.45 ? coolColors : warmColors;
            return pool[Math.floor(Math.random() * pool.length)];
        };

        let tiles = [];
        let startTime = null;        // marca de inicio para la construcción
        const BUILD_MS = 1600;       // duración de la construcción del mosaico

        // Curva orgánica de la cresta superior de la banda (ondas Batlló)
        const crestY = (x, w, h) => {
            const base = h * 0.72;
            return base
                + Math.sin(x / w * Math.PI * 3) * h * 0.06
                + Math.sin(x / w * Math.PI * 7 + 1.5) * h * 0.025;
        };

        const buildTiles = () => {
            tiles = [];
            const w = canvas.width;
            const h = canvas.height;
            const cell = w < 768 ? 24 : 32;   // tamaño aprox. de tesela
            const jitter = cell * 0.34;

            for (let gx = -cell; gx < w + cell; gx += cell) {
                const top = crestY(gx, w, h);
                for (let gy = top; gy < h + cell; gy += cell) {
                    if (gy < crestY(gx, w, h)) continue;
                    const depth = (gy - top) / (h - top);   // 0 arriba → 1 abajo
                    const col = pick(depth);
                    const jx = () => (Math.random() - 0.5) * jitter;
                    const jy = () => (Math.random() - 0.5) * jitter;
                    const cx = gx + cell / 2;
                    const cy = gy + cell / 2;
                    tiles.push({
                        // vértices relativos al centro (para poder escalar al construir)
                        rel: [
                            [-cell / 2 + jx(), -cell / 2 + jy()],
                            [ cell / 2 + jx(), -cell / 2 + jy()],
                            [ cell / 2 + jx(),  cell / 2 + jy()],
                            [-cell / 2 + jx(),  cell / 2 + jy()]
                        ],
                        cx, cy,
                        col,
                        base: Math.min(1, 0.82 + depth * 0.18),
                        shimmer: Math.random() * Math.PI * 2,
                        // retardo de aparición: de abajo hacia arriba + algo aleatorio
                        delay: (1 - depth) * BUILD_MS * 0.7 + Math.random() * BUILD_MS * 0.3
                    });
                }
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            buildTiles();
        };

        // easing suave para el encaje de cada tesela
        const easeOut = (k) => 1 - Math.pow(1 - k, 3);

        const draw = (now) => {
            if (startTime === null) startTime = now;
            const elapsed = now - startTime;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const t = elapsed / 1000;
            // reflejo de luz que recorre el mosaico, solo tras construirse
            const lightX = ((t * 55) % (canvas.width + 600)) - 300;

            for (const tile of tiles) {
                // progreso de construcción de esta tesela (0 → 1)
                const local = (elapsed - tile.delay) / 420;
                if (local <= 0) continue;                 // aún no aparece
                const grow = easeOut(Math.min(1, local)); // escala al encajar

                const [r, g, b] = tile.col;
                const dist = Math.abs(tile.cx - lightX);
                const glow = grow >= 1 ? Math.max(0, 1 - dist / 240) * 0.4 : 0;
                const pulse = grow >= 1 ? (Math.sin(t * 1.4 + tile.shimmer) + 1) * 0.05 : 0;
                const alpha = Math.min(0.96, tile.base * grow + glow + pulse);

                ctx.beginPath();
                for (let i = 0; i < tile.rel.length; i++) {
                    const px = tile.cx + tile.rel[i][0] * grow;
                    const py = tile.cy + tile.rel[i][1] * grow;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                const lift = glow * 95;
                ctx.fillStyle = `rgba(${r + lift}, ${g + lift}, ${b + lift}, ${alpha})`;
                ctx.fill();
                // junta de mortero clara (cerámica sobre pared perla)
                ctx.strokeStyle = `rgba(247, 241, 230, ${0.85 * grow})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        };

        const loop = (now) => {
            draw(now);
            requestAnimationFrame(loop);
        };

        resize();
        window.addEventListener('resize', () => { resize(); startTime = null; });
        requestAnimationFrame(loop);
    };

    /* ---------- Typewriter ---------- */
    const initTypewriter = () => {
        const phrases = [
            'Desarrollador Full Stack · Valencia',
            'Laravel · PHP · JavaScript · MySQL',
            '«La originalidad es volver al origen» — Gaudí',
            'Construyendo cosas reales'
        ];
        const target = document.getElementById('typewriter');
        let pi = 0, ci = 0, deleting = false;

        const tick = () => {
            const current = phrases[pi];
            target.textContent = deleting ? current.substring(0, ci--) : current.substring(0, ci++);
            if (!deleting && ci > current.length) { deleting = true; setTimeout(tick, 1800); return; }
            if (deleting && ci < 0) { deleting = false; pi = (pi + 1) % phrases.length; ci = 0; }
            setTimeout(tick, deleting ? 40 : 70);
        };
        tick();
    };

    /* ---------- Notificación ---------- */
    const showNotification = (msg) => {
        let note = document.querySelector('.notification');
        if (!note) {
            note = document.createElement('div');
            note.className = 'notification';
            document.body.appendChild(note);
        }
        note.textContent = msg;
        note.classList.add('is-visible');
        setTimeout(() => note.classList.remove('is-visible'), 2000);
    };

    /* ---------- Toggle portfolio ---------- */
    const initToggle = () => {
        const switchBtn = document.getElementById('switch');
        const backBtn = document.querySelector('.portfolio__back');
        let timer = null;

        switchBtn.addEventListener('click', () => {
            switchBtn.classList.toggle('is-on');
            if (switchBtn.classList.contains('is-on')) {
                showNotification('Cargando portfolio...');
                timer = setTimeout(() => document.body.classList.add('is-portfolio-open'), 1200);
            } else {
                clearTimeout(timer);
            }
        });

        backBtn.addEventListener('click', () => {
            document.body.classList.remove('is-portfolio-open');
            switchBtn.classList.remove('is-on');
        });
    };

    /* ---------- Enlaces internos ---------- */
    const initInternalLinks = () => {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('href').substring(1);
                if (!id) return;
                if (activateSection(id)) e.preventDefault();
            });
        });
    };

    /* ---------- Formulario ---------- */
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Función de envío pendiente de configurar');
        });
    };

    /* ---------- Init ---------- */
    initGaudi();
    initTypewriter();
    initToggle();
    initInternalLinks();
    initContactForm();
});

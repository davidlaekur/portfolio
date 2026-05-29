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
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');

        // Paleta marina de la Casa Batlló (vibrante)
        const palette = [
            [54, 140, 180],   // azul mar
            [70, 170, 200],   // azul cielo
            [90, 200, 205],   // turquesa
            [120, 215, 195],  // verde agua
            [165, 225, 200],  // verde claro
            [240, 160, 100],  // coral/terracota (destellos)
            [250, 205, 120]   // dorado arena
        ];

        let tiles = [];
        let t = 0;

        // Curva orgánica de la cresta superior de la banda (ondas Batlló)
        const crestY = (x, w, h) => {
            const base = h * 0.62;
            return base
                + Math.sin(x / w * Math.PI * 3) * h * 0.10
                + Math.sin(x / w * Math.PI * 7 + 1.5) * h * 0.04;
        };

        const buildTiles = () => {
            tiles = [];
            const w = canvas.width;
            const h = canvas.height;
            const cell = w < 768 ? 26 : 34;   // tamaño aprox. de tesela
            const jitter = cell * 0.32;

            for (let gx = -cell; gx < w + cell; gx += cell) {
                const top = crestY(gx, w, h);
                for (let gy = top; gy < h + cell; gy += cell) {
                    // saltar algunas para que el borde superior sea irregular
                    if (gy < crestY(gx, w, h)) continue;
                    const depth = (gy - top) / (h - top);   // 0 arriba → 1 abajo
                    const col = palette[Math.floor(Math.random() * palette.length)];
                    // vértices irregulares de cerámica rota
                    const jx = () => (Math.random() - 0.5) * jitter;
                    const jy = () => (Math.random() - 0.5) * jitter;
                    tiles.push({
                        pts: [
                            [gx + jx(), gy + jy()],
                            [gx + cell + jx(), gy + jy()],
                            [gx + cell + jx(), gy + cell + jy()],
                            [gx + jx(), gy + cell + jy()]
                        ],
                        col,
                        cx: gx + cell / 2,
                        // sólidas abajo, se difuminan suavemente solo en el borde superior
                        base: Math.min(0.92, 0.55 + depth * 0.4),
                        shimmer: Math.random() * Math.PI * 2
                    });
                }
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            buildTiles();
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.012;

            // reflejo de luz que recorre el mosaico (banda vertical suave)
            const lightX = ((t * 60) % (canvas.width + 600)) - 300;

            for (const tile of tiles) {
                const [r, g, b] = tile.col;
                // brillo extra cerca del reflejo móvil
                const dist = Math.abs(tile.cx - lightX);
                const glow = Math.max(0, 1 - dist / 260) * 0.35;
                const pulse = (Math.sin(t * 1.5 + tile.shimmer) + 1) * 0.05;
                const alpha = Math.min(0.95, tile.base + glow + pulse);

                ctx.beginPath();
                ctx.moveTo(tile.pts[0][0], tile.pts[0][1]);
                for (let i = 1; i < tile.pts.length; i++) {
                    ctx.lineTo(tile.pts[i][0], tile.pts[i][1]);
                }
                ctx.closePath();
                // tesela con brillo hacia el blanco según el reflejo
                const lift = glow * 90;
                ctx.fillStyle = `rgba(${r + lift}, ${g + lift}, ${b + lift}, ${alpha})`;
                ctx.fill();
                // junta de mortero entre teselas
                ctx.strokeStyle = 'rgba(7, 13, 20, 0.55)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        };

        const loop = () => {
            draw();
            requestAnimationFrame(loop);
        };

        resize();
        window.addEventListener('resize', resize);
        loop();
    };

    /* ---------- Typewriter ---------- */
    const initTypewriter = () => {
        const phrases = [
            'Desarrollador Full Stack · Valencia',
            'Laravel · PHP · JavaScript · MySQL',
            '«La originalidad es volver al origen» — Gaudí',
            'Construyendo cosas reales 🚀'
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

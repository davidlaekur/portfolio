/* =========================================================
   Portfolio · Davidlaekur
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    const CODEX_PHRASES = [
        "l'acqua e il vetturale della natura",
        "l'acqua disfa li monti e riempie le valli",
        "il volo degli uccelli",
        "la luce e l'ombra",
        "saper vedere",
        "ostinato rigore"
    ];

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
       VITRUVIO — dibujado con código sobre canvas propio
       Proporciones reales: círculo centrado en el ombligo,
       cuadrado desplazado hacia abajo (centro en entrepierna).
       Ratio lado/radio ≈ 1.64 (medición del original).
       ===================================================== */
    const initVitruvian = () => {
        const canvas = document.getElementById('vitruvian-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let animFrame = null;
        let progress = 0;
        let strokes = [];

        const buildStrokes = () => {
            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h / 2;
            const R = Math.min(w, h) * 0.28;
            const side = R * 1.64;
            const half = side / 2;

            // Centro del cuadrado desplazado hacia abajo respecto al círculo
            const sqCy = cy + R * 0.18;
            const sqTop = sqCy - half;

            const result = [];

            // Círculo (centro = ombligo = cy)
            const circle = [];
            for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.06) {
                circle.push([cx + R * Math.cos(a - Math.PI / 2), cy + R * Math.sin(a - Math.PI / 2)]);
            }
            result.push(circle);

            // Cuadrado
            result.push([
                [cx - half, sqTop],
                [cx + half, sqTop],
                [cx + half, sqTop + side],
                [cx - half, sqTop + side],
                [cx - half, sqTop]
            ]);

            // Referencia vertical
            const headR  = side * 0.068;
            const headCy = sqTop + headR * 1.1;
            const shoulder = headCy + headR * 1.3;
            const hip     = cy + R * 0.18;
            const foot    = sqTop + side;

            // Cabeza
            const head = [];
            for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.25) {
                head.push([cx + headR * Math.cos(a), headCy + headR * Math.sin(a)]);
            }
            result.push(head);

            // Tronco
            result.push([[cx, shoulder], [cx, hip]]);

            // Brazos horizontales (pose cuadrado — toca los lados del cuadrado)
            result.push([[cx - half, shoulder + side * 0.04], [cx + half, shoulder + side * 0.04]]);

            // Brazos en alto (pose círculo — toca la circunferencia)
            const armAngle = Math.PI / 5;
            result.push([[cx, shoulder], [cx - R * Math.cos(armAngle), cy - R * Math.sin(armAngle)]]);
            result.push([[cx, shoulder], [cx + R * Math.cos(armAngle), cy - R * Math.sin(armAngle)]]);

            // Piernas juntas (pose cuadrado)
            result.push([[cx, hip], [cx - side * 0.07, foot]]);
            result.push([[cx, hip], [cx + side * 0.07, foot]]);

            // Piernas abiertas (pose círculo — toca la circunferencia)
            const legAngle = Math.PI / 3.8;
            result.push([[cx, hip], [cx - R * Math.sin(legAngle), cy + R * Math.cos(legAngle * 0.6)]]);
            result.push([[cx, hip], [cx + R * Math.sin(legAngle), cy + R * Math.cos(legAngle * 0.6)]]);

            return result;
        };

        const totalSegments = (s) => s.reduce((n, st) => n + (st.length - 1), 0);

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(255, 210, 122, 0.22)';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';

            let drawn = 0;
            for (const st of strokes) {
                for (let i = 0; i < st.length - 1; i++) {
                    if (drawn >= progress) return;
                    ctx.beginPath();
                    ctx.moveTo(st[i][0], st[i][1]);
                    ctx.lineTo(st[i + 1][0], st[i + 1][1]);
                    ctx.stroke();
                    drawn++;
                }
            }

            // Firma tenue cuando el dibujo está completo
            if (progress >= totalSegments(strokes)) {
                ctx.fillStyle = 'rgba(255, 210, 122, 0.08)';
                ctx.font = '11px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('davidlaekur.com', canvas.width / 2, canvas.height - 12);
            }
        };

        const animate = () => {
            progress++;
            render();
            if (progress < totalSegments(strokes)) {
                animFrame = requestAnimationFrame(animate);
            }
        };

        const start = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            strokes = buildStrokes();
            progress = 0;
            if (animFrame) cancelAnimationFrame(animFrame);
            animate();
        };

        start();
        window.addEventListener('resize', start);
    };

    /* =====================================================
       LLUVIA EN ESCRITURA ESPECULAR
       Homenaje a la escritura en espejo de Leonardo da Vinci.
       Las frases doradas son de sus manuscritos reales.
       ===================================================== */
    const initMatrix = () => {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        const glyphs = "01{}[]<>/\\;:=+-*&|abcdefghijklmnopqrstuvwxyz".split('');
        const fontSize = 15;
        let columns = 0, drops = [], phraseCol = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = Array(columns).fill(1);
            phraseCol = Array(columns).fill(null);
        };

        const drawMirror = (text, x, y) => {
            ctx.save();
            ctx.translate(x + fontSize, y);
            ctx.scale(-1, 1);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(7, 13, 20, 0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < columns; i++) {
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                if (phraseCol[i]) {
                    const p = phraseCol[i];
                    const char = p.text[p.index] || ' ';
                    ctx.fillStyle = '#ffd27a';
                    drawMirror(char, x, y);
                    p.index++;
                    if (p.index >= p.text.length) phraseCol[i] = null;
                } else {
                    ctx.fillStyle = '#ff9400';
                    drawMirror(glyphs[Math.floor(Math.random() * glyphs.length)], x, y);
                }

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                    // Mayor probabilidad de frase para que se vean más
                    if (Math.random() > 0.85 && !phraseCol[i]) {
                        const text = CODEX_PHRASES[Math.floor(Math.random() * CODEX_PHRASES.length)];
                        phraseCol[i] = { text, index: 0 };
                    }
                }
                drops[i]++;
            }
        };

        resize();
        window.addEventListener('resize', resize);
        setInterval(draw, 60);
    };

    /* ---------- Typewriter ---------- */
    const initTypewriter = () => {
        const phrases = [
            'Desarrollador Full Stack Junior',
            'Disponible para freelance · Valencia',
            'Laravel · PHP · JavaScript · MySQL',
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
    initVitruvian();
    initMatrix();
    initTypewriter();
    initToggle();
    initInternalLinks();
    initContactForm();
});

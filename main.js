/* =========================================================
   Portfolio · Davidlaekur
   Lógica de interacción
   ---------------------------------------------------------
   Pantalla de inicio:
   - Lluvia de caracteres en ESCRITURA ESPECULAR (homenaje a
     Leonardo, que escribía sus códices de derecha a izquierda).
   - Entre las letras caen frases reales de sus manuscritos.
   - De fondo, el Hombre de Vitruvio se traza solo con código.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Frases reales de los códices de Leonardo ----------
       Fuentes: Codex Leicester, Manuscrito K, Codice sul volo degli uccelli. */
    const CODEX_PHRASES = [
        "l'acqua e il vetturale della natura",
        "l'acqua disfa li monti e riempie le valli",
        "il volo degli uccelli",
        "la luce e l'ombra",
        "saper vedere",
        "ostinato rigore"
    ];

    /* ---------- Utilidad: activar una sección ---------- */
    const activateSection = (id) => {
        const target = document.getElementById(id);
        if (!target) return false;

        document.querySelectorAll('.section').forEach((s) => s.classList.remove('is-active'));
        document.querySelectorAll('.portfolio-nav a').forEach((l) => l.classList.remove('is-active'));

        target.classList.add('is-active');
        const matchingNav = document.querySelector(`.portfolio-nav a[href="#${id}"]`);
        if (matchingNav) matchingNav.classList.add('is-active');

        document.getElementById('portfolio').scrollTo({ top: 0, behavior: 'smooth' });
        return true;
    };

    /* =====================================================
       FONDO 1 · Hombre de Vitruvio dibujado con código
       Se traza progresivamente sobre su propio canvas.
       ===================================================== */
    const initVitruvian = () => {
        const canvas = document.getElementById('vitruvian-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let cx, cy, R; // centro y radio base

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            cx = canvas.width / 2;
            cy = canvas.height / 2;
            R = Math.min(canvas.width, canvas.height) * 0.28; // radio del círculo
        };

        // Devuelve la lista de "trazos" (cada uno es un array de puntos)
        const buildStrokes = () => {
            const s = R; // medio lado del cuadrado ≈ radio (proporción real ~1.64 lado/radio)
            const side = R * 1.64;          // lado del cuadrado
            const half = side / 2;
            const squareTop = cy - half * 0.78; // cuadrado desplazado hacia arriba
            const strokes = [];

            // Círculo (centro en el ombligo)
            const circle = [];
            for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.08) {
                circle.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
            }
            strokes.push(circle);

            // Cuadrado (centro desplazado respecto al círculo, como en el original)
            strokes.push([
                [cx - half, squareTop],
                [cx + half, squareTop],
                [cx + half, squareTop + side],
                [cx - half, squareTop + side],
                [cx - half, squareTop]
            ]);

            // Figura esquemática · pose 1: brazos horizontales, piernas juntas
            const headTop = squareTop + side * 0.04;
            const headR = side * 0.07;
            const shoulder = headTop + headR * 2;
            const hip = cy + R * 0.15;
            const foot = squareTop + side;

            // cabeza
            const head = [];
            for (let a = 0; a <= Math.PI * 2 + 0.05; a += 0.2) {
                head.push([cx + headR * Math.cos(a), headTop + headR + headR * Math.sin(a)]);
            }
            strokes.push(head);

            // tronco
            strokes.push([[cx, shoulder], [cx, hip]]);
            // brazos horizontales (pose cuadrado)
            strokes.push([[cx - half, shoulder + side * 0.05], [cx + half, shoulder + side * 0.05]]);
            // brazos en alto (pose círculo)
            strokes.push([[cx, shoulder + side * 0.03], [cx - R * 0.82, cy - R * 0.5]]);
            strokes.push([[cx, shoulder + side * 0.03], [cx + R * 0.82, cy - R * 0.5]]);
            // piernas juntas (pose cuadrado)
            strokes.push([[cx, hip], [cx - side * 0.06, foot]]);
            strokes.push([[cx, hip], [cx + side * 0.06, foot]]);
            // piernas abiertas (pose círculo)
            strokes.push([[cx, hip], [cx - R * 0.62, cy + R * 0.78]]);
            strokes.push([[cx, hip], [cx + R * 0.62, cy + R * 0.78]]);

            return strokes;
        };

        let strokes = [];
        let progress = 0; // cuántos segmentos llevamos dibujados

        const totalSegments = () => strokes.reduce((n, st) => n + (st.length - 1), 0);

        const drawProgressive = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(255, 210, 122, 0.20)'; // dorado muy tenue
            ctx.lineWidth = 1;

            let drawn = 0;
            for (const st of strokes) {
                ctx.beginPath();
                for (let i = 0; i < st.length - 1; i++) {
                    if (drawn >= progress) break;
                    ctx.moveTo(st[i][0], st[i][1]);
                    ctx.lineTo(st[i + 1][0], st[i + 1][1]);
                    drawn++;
                }
                ctx.stroke();
            }

            if (progress < totalSegments()) {
                progress += 1; // velocidad de trazado
                requestAnimationFrame(drawProgressive);
            }
        };

        const start = () => {
            resize();
            strokes = buildStrokes();
            progress = 0;
            drawProgressive();
        };

        start();
        window.addEventListener('resize', () => {
            strokes = buildStrokes();
            // se mantiene dibujado completo tras redimensionar
            progress = totalSegments();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawProgressive();
        });
    };

    /* =====================================================
       FONDO 2 · Lluvia en escritura especular
       ===================================================== */
    const initMatrix = () => {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        const glyphs = "01{}[]<>/\\;:=+-*&|abcdefghijklmnopqrstuvwxyz".split('');
        const fontSize = 15;

        let columns = 0;
        let drops = [];
        let phraseCol = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = Array(columns).fill(1);
            phraseCol = Array(columns).fill(null);
        };

        const drawGlyph = (text, x, y) => {
            ctx.save();
            ctx.translate(x + fontSize, y); // volteo horizontal = escritura especular
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
                    drawGlyph(char, x, y);
                    p.index++;
                    if (p.index >= p.text.length) phraseCol[i] = null;
                } else {
                    const char = glyphs[Math.floor(Math.random() * glyphs.length)];
                    ctx.fillStyle = '#ff9400';
                    drawGlyph(char, x, y);
                }

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                    if (Math.random() > 0.97 && !phraseCol[i]) {
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

    /* ---------- Efecto máquina de escribir ---------- */
    const initTypewriter = () => {
        const phrases = [
            'Desarrollador Full Stack Junior',
            'Disponible para freelance · Valencia',
            'Laravel · PHP · JavaScript · MySQL',
            'Construyendo cosas reales 🚀'
        ];
        const target = document.getElementById('typewriter');
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const tick = () => {
            const current = phrases[phraseIndex];
            target.textContent = isDeleting
                ? current.substring(0, charIndex--)
                : current.substring(0, charIndex++);

            if (!isDeleting && charIndex > current.length) {
                isDeleting = true;
                setTimeout(tick, 1800);
                return;
            }
            if (isDeleting && charIndex < 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                charIndex = 0;
            }
            setTimeout(tick, isDeleting ? 40 : 70);
        };

        tick();
    };

    /* ---------- Notificación temporal ---------- */
    const showNotification = (message) => {
        let note = document.querySelector('.notification');
        if (!note) {
            note = document.createElement('div');
            note.className = 'notification';
            document.body.appendChild(note);
        }
        note.textContent = message;
        note.classList.add('is-visible');
        setTimeout(() => note.classList.remove('is-visible'), 2000);
    };

    /* ---------- Abrir / cerrar portfolio ---------- */
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

    /* ---------- Formulario de contacto ---------- */
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Función de envío pendiente de configurar');
        });
    };

    /* ---------- Inicialización ---------- */
    initVitruvian();
    initMatrix();
    initTypewriter();
    initToggle();
    initInternalLinks();
    initContactForm();
});

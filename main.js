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
       LLUVIA DE CÓDIGO
       Las frases doradas son citas reales de los cuadernos
       de Leonardo da Vinci.
       ===================================================== */
    const initMatrix = () => {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        const glyphs = [...new Set(CODEX_PHRASES.join('').replace(/[^a-z]/g, ''))].sort();
        const fontSize = 15;
        let columns = 0, drops = [], phraseCol = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            columns = Math.floor(canvas.width / fontSize);
            drops = Array(columns).fill(1);
            phraseCol = Array(columns).fill(null);
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
                    ctx.fillText(char, x, y);
                    p.index++;
                    if (p.index >= p.text.length) phraseCol[i] = null;
                } else {
                    ctx.fillStyle = '#ff9400';
                    ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], x, y);
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
        setInterval(draw, 120);
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
    initMatrix();
    initTypewriter();
    initToggle();
    initInternalLinks();
    initContactForm();
});

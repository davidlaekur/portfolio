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
       CODEX DA VINCI
       Fragmentos reales de los cuadernos de Leonardo da Vinci.
       Aparecen y desaparecen suavemente como páginas de sus
       manuscritos: Codex Atlanticus, Codex Leicester, etc.
       ===================================================== */
    const initCodex = () => {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');

        const phrases = [
            "saper vedere",
            "ostinato rigore",
            "l'acqua è il vetturale della natura",
            "l'acqua disfa li monti e riempie le valli",
            "il volo degli uccelli",
            "la luce e l'ombra",
            "la meccanica è il paradiso delle scienze matematiche",
            "la pittura è una poesia muta",
            "il sole non si muove",
            "l'occhio è la finestra dell'anima",
            "dove la natura finisce, lì comincia l'arte",
            "ogni ostacolo è distrutto dall'ardore"
        ];

        let fragments = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const spawn = () => {
            const text = phrases[Math.floor(Math.random() * phrases.length)];
            const fontSize = 12 + Math.floor(Math.random() * 6);
            const margin = 100;
            const x = margin + Math.random() * (canvas.width - margin * 2);
            const y = margin + Math.random() * (canvas.height - margin * 2);
            fragments.push({ text, x, y, fontSize, opacity: 0, state: 'in', hold: 0 });
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = fragments.length - 1; i >= 0; i--) {
                const f = fragments[i];
                if (f.state === 'in') {
                    f.opacity += 0.003;
                    if (f.opacity >= 0.28) { f.opacity = 0.28; f.state = 'hold'; }
                } else if (f.state === 'hold') {
                    f.hold++;
                    if (f.hold > 160) f.state = 'out';
                } else {
                    f.opacity -= 0.002;
                    if (f.opacity <= 0) { fragments.splice(i, 1); continue; }
                }
                ctx.fillStyle = `rgba(255, 210, 122, ${f.opacity})`;
                ctx.font = `italic ${f.fontSize}px Georgia, serif`;
                ctx.fillText(f.text, f.x, f.y);
            }

            if (fragments.length < 8 && Math.random() > 0.985) spawn();
        };

        for (let i = 0; i < 5; i++) spawn();

        resize();
        window.addEventListener('resize', resize);
        setInterval(draw, 50);
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
    initCodex();
    initTypewriter();
    initToggle();
    initInternalLinks();
    initContactForm();
});

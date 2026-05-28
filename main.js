/* =========================================================
   Portfolio · Davidlaekur
   Lógica de interacción
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

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

    /* ---------- Fondo Matrix ---------- */
    const initMatrix = () => {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');
        const chars = '01{}[]<>/\\;:=+-*&|abcdefghijklmnopqrstuvwxyz'.split('');
        const fontSize = 13;
        let drops = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
        };

        const draw = () => {
            ctx.fillStyle = 'rgba(7, 13, 20, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ff9400';
            ctx.font = `${fontSize}px monospace`;

            drops.forEach((y, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, y * fontSize);
                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            });
        };

        resize();
        window.addEventListener('resize', resize);
        setInterval(draw, 55);
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

    /* ---------- Enlaces internos (nav + botones internos) ---------- */
    const initInternalLinks = () => {
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('href').substring(1);
                if (!id) return;
                if (activateSection(id)) {
                    e.preventDefault();
                }
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
    initMatrix();
    initTypewriter();
    initToggle();
    initInternalLinks();
    initContactForm();
});

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
       HOMENAJE A GAUDÍ — Catenarias
       Gaudí diseñaba sus estructuras con maquetas de cuerdas
       colgantes (la "maqueta polifunicular"). Cada cuerda
       describe una catenaria: y = a·cosh(x/a). Invertida, es
       el arco perfecto. Aquí las dibujamos a ambos lados,
       dejando el centro libre para la presentación.
       ===================================================== */
    const initGaudi = () => {
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');

        // Paleta trencadís (mosaicos del Park Güell)
        const colors = [
            'rgba(255, 179, 71, ALPHA)',   // ámbar
            'rgba(255, 107, 107, ALPHA)',  // coral
            'rgba(122, 197, 205, ALPHA)',  // turquesa
            'rgba(255, 210, 122, ALPHA)',  // dorado
            'rgba(180, 142, 173, ALPHA)'   // lila
        ];

        let arcs = [];
        let t = 0;

        const buildSide = (originX, dir, count) => {
            // dir = +1 (lado derecho) o -1 (lado izquierdo)
            const list = [];
            for (let i = 0; i < count; i++) {
                const span = 90 + i * 55;          // ancho del arco
                const a = 70 + Math.random() * 60;  // tensión de la catenaria
                const anchorY = canvas.height * (0.12 + Math.random() * 0.76);
                list.push({
                    originX,
                    dir,
                    span,
                    a,
                    anchorY,
                    color: colors[i % colors.length],
                    phase: Math.random() * Math.PI * 2,
                    amp: 4 + Math.random() * 6
                });
            }
            return list;
        };

        const buildArcs = () => {
            const n = canvas.width < 768 ? 3 : 6;
            arcs = [
                ...buildSide(0, 1, n),                 // pegado al borde izquierdo
                ...buildSide(canvas.width, -1, n)      // pegado al borde derecho
            ];
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            buildArcs();
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 0.01;

            for (const arc of arcs) {
                // leve balanceo, como cuerdas que cuelgan
                const sway = Math.sin(t + arc.phase) * arc.amp;
                ctx.beginPath();
                const steps = 40;
                for (let s = 0; s <= steps; s++) {
                    const px = (s / steps) * arc.span;            // 0 → span
                    const local = px - arc.span / 2;              // centrado
                    // catenaria invertida (arco): cae desde el ancla
                    const y = arc.anchorY + arc.a * Math.cosh(local / arc.a) - arc.a + sway;
                    const x = arc.originX + arc.dir * px;
                    if (s === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = arc.color.replace('ALPHA', '0.22');
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }
        };

        resize();
        window.addEventListener('resize', resize);
        setInterval(draw, 33);
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

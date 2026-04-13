(() => {

    /* ================================================
       STARS BACKGROUND
    ================================================ */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];

    const resize = () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    };

    const initStars = () => {
        stars = Array.from({ length: 120 }, () => ({
            x:  Math.random() * W,
            y:  Math.random() * H,
            r:  Math.random() * 1.5 + 0.3,
            a:  Math.random(),
            da: (Math.random() - 0.5) * 0.004,
            dy: Math.random() * 0.08 + 0.02
        }));
    };

    const drawStars = () => {
        ctx.clearRect(0, 0, W, H);
        stars.forEach(s => {
            s.a += s.da;
            if (s.a < 0) { s.a = 0; s.da *= -1; }
            if (s.a > 1) { s.a = 1; s.da *= -1; }
            s.y += s.dy;
            if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180,200,255,${s.a * 0.5})`;
            ctx.fill();
        });
        requestAnimationFrame(drawStars);
    };

    window.addEventListener('resize', () => { resize(); initStars(); });
    resize();
    initStars();
    drawStars();


    /* ================================================
       CUSTOM CURSOR
    ================================================ */
    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');
    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    const animCursor = () => {
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        cursorRing.style.left = rx + 'px';
        cursorRing.style.top  = ry + 'px';
        requestAnimationFrame(animCursor);
    };
    animCursor();

    document.querySelectorAll('a, button, .card, .chip, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width      = '14px';
            cursor.style.height     = '14px';
            cursor.style.background = 'var(--red)';
            cursorRing.style.width  = '44px';
            cursorRing.style.height = '44px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width      = '8px';
            cursor.style.height     = '8px';
            cursor.style.background = 'var(--cyan)';
            cursorRing.style.width  = '32px';
            cursorRing.style.height = '32px';
        });
    });


    /* ================================================
       NAV: SCROLL STYLE + ACTIVE LINK
    ================================================ */
    const navbar   = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    });


    /* ================================================
       HAMBURGER MOBILE MENU
    ================================================ */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    document.querySelectorAll('.mob-link').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });


    /* ================================================
       SCROLL REVEAL
    ================================================ */
    const reveals    = document.querySelectorAll('.reveal');
    const revealObs  = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach(el => revealObs.observe(el));


    /* ================================================
       STAT BARS ANIMATION
    ================================================ */
    const statObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.stat-fill').forEach(bar => {
                    bar.style.width = bar.dataset.val + '%';
                });
                statObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.4 });

    const statSection = document.getElementById('statBars');
    if (statSection) statObs.observe(statSection);


    /* ================================================
       PORTFOLIO FILTER
    ================================================ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('#portfolioGrid .card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const tags = card.dataset.tags || '';
                const show = filter === 'all' || tags.includes(filter);

                card.style.transition = 'opacity 0.3s, transform 0.3s';

                if (show) {
                    card.style.display    = '';
                    // Force reflow so transition fires
                    void card.offsetHeight;
                    card.style.opacity   = '1';
                    card.style.transform = '';
                } else {
                    card.style.opacity   = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        if (btn.dataset.filter !== 'all' && !card.dataset.tags.includes(btn.dataset.filter)) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });


    /* ================================================
       CONTACT FORM
    ================================================ */
    const form    = document.getElementById('contactForm');
    const formMsg = document.getElementById('formMsg');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const name  = document.getElementById('fname').value.trim();
            const email = document.getElementById('femail').value.trim();
            const msg   = document.getElementById('fmsg').value.trim();

            if (!name || !email || !msg) return;

            const btn = form.querySelector('.submit-btn');
            btn.textContent = 'Sending…';
            btn.disabled    = true;

            setTimeout(() => {
                formMsg.classList.add('success');
                form.reset();
                btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                btn.disabled  = false;
            }, 1200);
        });
    }


    /* ================================================
       SMOOTH SCROLL (fallback for older browsers)
    ================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();

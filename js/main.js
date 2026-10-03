/* ============================================================
   SLUMBER REALMS STUDIO — main.js
   Starfield · Scroll animations · Nav · Particles · Parallax
   ============================================================ */

// ---- Starfield ----
(function () {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], shooters = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkStar() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      base: Math.random() * 0.7 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
      hue: Math.random() > 0.85 ? (Math.random() > 0.5 ? 280 : 200) : 0,
    };
  }

  function initStars() {
    stars = [];
    const count = Math.floor((W * H) / 4800);
    for (let i = 0; i < count; i++) stars.push(mkStar());
  }

  function spawnShooter() {
    const angle = (Math.random() * 30 + 15) * (Math.PI / 180);
    shooters.push({
      x: Math.random() * W * 0.6,
      y: Math.random() * H * 0.4,
      len: Math.random() * 140 + 80,
      speed: Math.random() * 8 + 6,
      angle,
      vx: Math.cos(angle),
      vy: Math.sin(angle),
      life: 1,
      decay: Math.random() * 0.015 + 0.01,
    });
  }

  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, W, H);

    // stars
    const t = frame * 0.016;
    for (const s of stars) {
      const alpha = s.base + Math.sin(t * s.speed * 60 + s.phase) * 0.35;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      if (s.hue) {
        ctx.fillStyle = `hsla(${s.hue},80%,80%,${Math.max(0, alpha)})`;
      } else {
        ctx.fillStyle = `rgba(248,248,255,${Math.max(0, alpha)})`;
      }
      ctx.fill();
    }

    // shooting stars
    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      const grd = ctx.createLinearGradient(
        sh.x, sh.y,
        sh.x - sh.vx * sh.len, sh.y - sh.vy * sh.len
      );
      grd.addColorStop(0, `rgba(200,130,255,${sh.life * 0.9})`);
      grd.addColorStop(1, 'rgba(200,130,255,0)');
      ctx.strokeStyle = grd;
      ctx.lineWidth = sh.life * 1.5;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * sh.len, sh.y - sh.vy * sh.len);
      ctx.stroke();
      sh.x += sh.vx * sh.speed;
      sh.y += sh.vy * sh.speed;
      sh.life -= sh.decay;
      if (sh.life <= 0) shooters.splice(i, 1);
    }

    frame++;
    requestAnimationFrame(tick);
  }

  // Spawn shooter every 3–7 s
  function scheduleShooter() {
    spawnShooter();
    setTimeout(scheduleShooter, Math.random() * 4000 + 3000);
  }

  window.addEventListener('resize', () => { resize(); initStars(); });
  resize();
  initStars();
  tick();
  setTimeout(scheduleShooter, 2500);
})();

// ---- Floating particles ----
(function () {
  const wrap = document.getElementById('particles');
  const COUNT = 20;
  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * 20}s;
      opacity: 0;
    `;
    wrap.appendChild(p);
  }
})();

// ---- Navigation scroll effect ----
(function () {
  const nav = document.getElementById('navbar');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    lastY = y;
  }, { passive: true });
})();

// ---- Hamburger menu ----
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('navLinks');
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  // Close on nav link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// ---- Scroll animations (Intersection Observer) ----
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  // Observe all .fade-up — including those added after DOMContentLoaded
  function observeAll() {
    document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
  }
  observeAll();

  // Hero elements visible immediately
  setTimeout(() => {
    document.querySelectorAll('#hero .fade-up').forEach(el => el.classList.add('visible'));
  }, 200);
})();

// ---- Parallax hero logo on mouse move ----
(function () {
  const hero = document.getElementById('hero');
  const logo = document.getElementById('heroLogo');
  if (!logo || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    logo.style.transform = `translate(${dx * 14}px, ${dy * 10}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    logo.style.transform = '';
  });
})();

// ---- Smooth active nav link on scroll ----
(function () {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const links    = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = [...links].find(l => l.getAttribute('href') === `#${e.target.id}`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();

// ---- Package card cursor glow follow ----
(function () {
  document.querySelectorAll('.pkg-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
})();

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// ─── Animated glowing mesh background ───
(() => {
  const canvas = document.getElementById('mesh-bg');
  const ctx = canvas.getContext('2d');
  let w, h, nodes;

  const ACCENT = '47,82,224';   // matches --accent #2f52e0
  const SOFT   = '154,148,142'; // matches --ink-soft

  const NODE_COUNT = 55;
  const LINK_DIST  = 160;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight * 1.2; // covers hero comfortably
    canvas.style.height = h + 'px';
  }

  function makeNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 1,
      glow: Math.random() > 0.8 // some nodes glow brighter (accent color)
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    // move nodes
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    });

    // draw connecting lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const opacity = (1 - dist / LINK_DIST) * 0.35;
          ctx.strokeStyle = `rgba(${SOFT},${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // draw nodes (glowing dots)
    nodes.forEach(n => {
      ctx.beginPath();
      const color = n.glow ? ACCENT : SOFT;
      ctx.fillStyle = `rgba(${color},${n.glow ? 0.9 : 0.5})`;
      if (n.glow) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${ACCENT},0.8)`;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(step);
  }

  resize();
  makeNodes();
  step();

  window.addEventListener('resize', () => {
    resize();
    makeNodes();
  });
})();

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll-reveal: fade + slide sections in on scroll
const revealEls = document.querySelectorAll(
  '.timeline-card, .skill-item, .project-card, .contact-link'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Navbar pill — shrink slightly on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 60) {
    navbar.style.top = '8px';
  } else {
    navbar.style.top = '14px';
  }
});
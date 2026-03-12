document.addEventListener('DOMContentLoaded', function() {
  const fadeEls = document.querySelectorAll('.fadein');
  const showOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.92;
    fadeEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if(rect.top < triggerBottom) {
        el.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', showOnScroll);
  showOnScroll();
});

// パーティクルアニメーション
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_NUM = 48;
  const COLOR_LIST = ['rgba(255,255,255,0.7)','rgba(220,220,220,0.5)','rgba(240,240,240,0.8)'];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_NUM; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.2 + Math.random() * 2.8,
        dx: -0.2 + Math.random() * 0.4,
        dy: -0.15 + Math.random() * 0.3,
        color: COLOR_LIST[Math.floor(Math.random() * COLOR_LIST.length)]
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function updateParticles() {
    for (let p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      // 画面外に出たら反対側に戻す
      if (p.x < -p.r) p.x = canvas.width + p.r;
      if (p.x > canvas.width + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = canvas.height + p.r;
      if (p.y > canvas.height + p.r) p.y = -p.r;
    }
  }

  function animate() {
    drawParticles();
    updateParticles();
    requestAnimationFrame(animate);
  }

  function init() {
    resizeCanvas();
    createParticles();
    animate();
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  init();
})(); 
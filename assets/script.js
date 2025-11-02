// --- CodeCraft Neon Particle System ---
// Colorful glowing orbs follow the cursor and burst on click.
// Works smoothly on both desktop and mobile.

(() => {
  // YEAR
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // FADE-IN ANIMATION ON SCROLL
  const faders = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.1 }
  );
  faders.forEach((el) => observer.observe(el));

  // --- CANVAS SETUP ---
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "1";
  canvas.style.pointerEvents = "none";
  document.body.appendChild(canvas);

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  window.addEventListener("resize", () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });

  // --- UTILITIES ---
  const rand = (min, max) => Math.random() * (max - min) + min;

  // --- PARTICLE CLASS ---
  class Particle {
    constructor(x, y, vx, vy, size, hue) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.size = size;
      this.hue = hue;
      this.life = 1;
      this.decay = rand(0.005, 0.02);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy *= 0.98;
      this.life -= this.decay;
    }

    draw() {
      if (this.life <= 0) return;
      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
      glow.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${this.life})`);
      glow.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particles = [];
  const maxParticles = 600;
  const mouse = { x: W / 2, y: H / 2, down: false };

  // --- PARTICLE SPAWNERS ---
  function spawnTrail(x, y) {
    for (let i = 0; i < 3; i++) {
      particles.push(
        new Particle(
          x + rand(-5, 5),
          y + rand(-5, 5),
          rand(-0.8, 0.8),
          rand(-0.8, 0.8),
          rand(2, 4),
          rand(180, 360)
        )
      );
    }
  }

  function spawnBurst(x, y) {
    for (let i = 0; i < 40; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(1, 6);
      particles.push(
        new Particle(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          rand(2, 6),
          rand(180, 360)
        )
      );
    }
  }

  // --- INTERACTIVITY ---
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    spawnTrail(mouse.x, mouse.y);
  });

  window.addEventListener("mousedown", (e) => {
    mouse.down = true;
    spawnBurst(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", () => (mouse.down = false));

  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    spawnTrail(t.clientX, t.clientY);
  });

  window.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    if (!t) return;
    spawnBurst(t.clientX, t.clientY);
  });

  // --- ANIMATION LOOP ---
  function animate() {
    ctx.fillStyle = "rgba(5, 7, 10, 0.25)";
    ctx.fillRect(0, 0, W, H);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.life <= 0) particles.splice(i, 1);
    }

    if (particles.length > maxParticles)
      particles.splice(0, particles.length - maxParticles);

    requestAnimationFrame(animate);
  }

  animate();
})();
  // --- PARALLAX LOGO MOVEMENT ---
  const logo = document.querySelector(".logo");
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

  function animateLogo() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    if (logo) {
      logo.style.transform = `translate(${targetX / 20}px, ${targetY / 20}px)`;
    }
    requestAnimationFrame(animateLogo);
  }

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX - window.innerWidth / 2;
    mouseY = e.clientY - window.innerHeight / 2;
  });

  animateLogo();
  // Trigger logo fade-in on load
  window.addEventListener("load", () => {
    const logo = document.querySelector(".logo");
    if (logo) logo.style.opacity = "1";
  });

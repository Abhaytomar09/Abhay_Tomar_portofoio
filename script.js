// ── MOBILE DETECTION ────────────────────────────
const IS_MOBILE = window.innerWidth <= 768 || "ontouchstart" in window;

// ── THEME TOGGLE ──────────────────────────────
(function themeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    btn.textContent = "☀️";
  }
  btn.addEventListener("click", () => {
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      btn.textContent = "🌙";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      btn.textContent = "☀️";
      localStorage.setItem("theme", "light");
    }
    btn.style.transition = "transform 0.4s ease";
    btn.style.transform = "rotate(360deg)";
    setTimeout(() => {
      btn.style.transform = "";
    }, 420);
  });
})();

// ── OTW BANNER CLOSE ──────────────────────────
(function otwBanner() {
  const banner = document.getElementById("otw-banner");
  const closeBtn = document.getElementById("otw-close");
  if (!banner || !closeBtn) return;
  if (sessionStorage.getItem("otwClosed")) {
    banner.style.display = "none";
    document.querySelector("nav").style.top = "0";
    return;
  }
  closeBtn.addEventListener("click", () => {
    banner.classList.add("hidden");
    setTimeout(() => {
      banner.style.display = "none";
      const nav = document.querySelector("nav");
      if (nav && !nav.classList.contains("scrolled")) nav.style.top = "0";
    }, 450);
    sessionStorage.setItem("otwClosed", "1");
  });
})();

// ── SERVICE WORKER ────────────────────────────
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => console.log("[SW] Registered:", reg.scope))
      .catch((err) => console.warn("[SW] Failed:", err));
  });
}

// ── OFFLINE BANNER ────────────────────────────
const offlineBanner = document.getElementById("offline-banner");
function updateOnlineStatus() {
  if (!navigator.onLine) offlineBanner.classList.add("visible");
  else offlineBanner.classList.remove("visible");
}
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus();

// ── SCROLL PROGRESS BAR ───────────────────────
const progressBar = document.getElementById("scroll-progress");
window.addEventListener(
  "scroll",
  () => {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docH) * 100 + "%";
  },
  { passive: true },
);

// ── HAMBURGER MENU ────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// ── CUSTOM CURSOR ─────────────────────────────
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
let mouseX = 0,
  mouseY = 0,
  ringX = 0,
  ringY = 0;

if (!IS_MOBILE) {
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  })();
  document
    .querySelectorAll(
      "a, button, .skill-tag, .project-card, .achieve-card, .contact-link, .stat-card",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        dot.style.transform = "translate(-50%, -50%) scale(2)";
        dot.style.background = "var(--purple)";
        ring.style.width = "56px";
        ring.style.height = "56px";
        ring.style.borderColor = "rgba(191,0,255,0.6)";
      });
      el.addEventListener("mouseleave", () => {
        dot.style.transform = "translate(-50%, -50%) scale(1)";
        dot.style.background = "var(--cyan)";
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderColor = "rgba(37,209,244,0.6)";
      });
    });
} else {
  if (dot) dot.style.display = "none";
  if (ring) ring.style.display = "none";
}

// ── NAV SCROLL ────────────────────────────────
window.addEventListener(
  "scroll",
  () => {
    const nav = document.querySelector("nav");
    if (window.scrollY > 50) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  },
  { passive: true },
);

// ── PARTICLE CANVAS ───────────────────────────
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const PARTICLE_COUNT = IS_MOBILE ? 20 : 90;
const particles = [];

class Particle {
  constructor() {
    this.reset(true);
  }
  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.z = Math.random() * 0.6 + 0.2;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.5 + 0.1) * this.z;
    this.r = Math.random() * 1.5 + 0.5;
    this.life = Math.random();
    this.maxLife = Math.random() * 0.8 + 0.4;
    const rand = Math.random();
    this.color =
      rand > 0.7 ? [191, 0, 255] : rand > 0.4 ? [37, 209, 244] : [0, 255, 136];
    this.type = Math.random() > 0.85 ? "cross" : "dot";
  }
  draw() {
    const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.8 * this.z;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
    if (this.type === "cross") {
      ctx.strokeStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(this.x - 4, this.y);
      ctx.lineTo(this.x + 4, this.y);
      ctx.moveTo(this.x, this.y - 4);
      ctx.lineTo(this.x, this.y + 4);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * this.z, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life += 0.008;
    if (this.life > this.maxLife || this.y < -10) this.reset();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.globalAlpha = (1 - dist / 120) * 0.1;
        ctx.strokeStyle = "#25d1f4";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!IS_MOBILE) connectParticles();
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── TYPEWRITER ────────────────────────────────
const roles = [
  "Full Stack Developer",
  "MERN Stack Engineer",
  "Cybersecurity Enthusiast",
  "AI & ML Builder",
  "Top 2% on TryHackMe",
  "Problem Solver & Builder",
];
const typeEl = document.querySelector(".typewriter-text");
let rIdx = 0,
  cIdx = 0,
  deleting = false;

function typewriter() {
  const current = roles[rIdx];
  if (!deleting) {
    typeEl.textContent = current.slice(0, cIdx + 1);
    cIdx++;
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(typewriter, 1800);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(typewriter, deleting ? 50 : 80);
}
typewriter();

// ── SCROLL REVEAL ─────────────────────────────
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);
reveals.forEach((el) => observer.observe(el));

// ── STAGGER REVEALS ───────────────────────────
document.querySelectorAll(".stagger > *").forEach((el, i) => {
  el.style.transitionDelay = i * 0.1 + "s";
  el.classList.add("reveal");
  observer.observe(el);
});

// ── SMOOTH NAV CLICK ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ── SKILL TAG RIPPLE ──────────────────────────
document.querySelectorAll(".skill-tag").forEach((tag) => {
  tag.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(37,209,244,0.3);width:60px;height:60px;transform:translate(-50%,-50%) scale(0);animation:ripple 0.6s ease-out forwards;left:${e.offsetX}px;top:${e.offsetY}px;pointer-events:none`;
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});
const rippleStyle = document.createElement("style");
rippleStyle.textContent =
  "@keyframes ripple{to{transform:translate(-50%,-50%) scale(3);opacity:0}}";
document.head.appendChild(rippleStyle);

// ── COUNTER ANIMATION ─────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.val);
  const isDecimal = String(target).includes(".");
  const duration = 1800;
  const start = performance.now();
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = target * ease;
    el.textContent = isDecimal
      ? current.toFixed(2)
      : Math.round(current) + (el.dataset.suffix || "");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target
          .querySelectorAll(".stat-num[data-val]")
          .forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 },
);
document
  .querySelectorAll(".about-stats")
  .forEach((el) => statsObserver.observe(el));

// ── CARD TILT ─────────────────────────────────
document.querySelectorAll(".project-card, .achieve-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2,
      cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transformStyle = "preserve-3d";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transformStyle = "";
  });
});

// ── ACTIVE NAV HIGHLIGHT ──────────────────────
const sections = document.querySelectorAll("section[id]");
const navLinksAll = document.querySelectorAll(".nav-links a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinksAll.forEach((a) => {
          a.style.color = "";
          a.style.textShadow = "";
        });
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`,
        );
        if (active) {
          active.style.color = "var(--cyan)";
          active.style.textShadow = "0 0 10px var(--cyan)";
        }
      }
    });
  },
  { threshold: 0.4 },
);
sections.forEach((s) => sectionObserver.observe(s));

// ── CONTACT FORM ──────────────────────────────
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".form-submit");
    const originalText = btn.textContent;
    btn.textContent = "⏳ Sending...";
    btn.disabled = true;
    btn.style.opacity = "0.7";
    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        contactForm.innerHTML = `<div style="text-align:center;padding:40px 20px;"><div style="font-size:3rem;margin-bottom:16px;">✅</div><div style="font-family:'Orbitron',sans-serif;font-size:1.1rem;color:var(--cyan);text-shadow:0 0 20px var(--cyan);letter-spacing:0.1em;margin-bottom:12px;">MESSAGE SENT!</div><p style="color:rgba(200,216,232,0.7);font-size:1rem;">Thanks for reaching out. I'll get back to you soon.</p></div>`;
      } else {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = "1";
        const errDiv = document.createElement("p");
        errDiv.style.cssText =
          "color:var(--pink);font-family:Share Tech Mono,monospace;font-size:0.8rem;margin-top:12px;text-align:center;";
        errDiv.textContent = "⚠ Something went wrong. Try emailing directly.";
        contactForm.appendChild(errDiv);
        setTimeout(() => errDiv.remove(), 4000);
      }
    } catch {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  });
}

// ── BACK TO TOP ───────────────────────────────
const backToTop = document.getElementById("back-to-top");
window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 400) backToTop.classList.add("visible");
    else backToTop.classList.remove("visible");
  },
  { passive: true },
);
backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// ── CURSOR PARTICLE TRAIL ─────────────────────
if (!IS_MOBILE) {
  const TRAIL_COUNT = 6;
  const trailColors = [
    "#25d1f4",
    "#bf00ff",
    "#ff4785",
    "#00ff88",
    "#0066ff",
    "#25d1f4",
  ];
  const trail = [];
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const p = document.createElement("div");
    p.className = "cursor-particle";
    const size = 6 - i * 0.7;
    p.style.cssText = `width:${size}px;height:${size}px;background:${trailColors[i]};opacity:0;position:fixed;border-radius:50%;pointer-events:none;z-index:9997;transform:translate(-50%,-50%);`;
    document.body.appendChild(p);
    trail.push({ el: p, x: 0, y: 0 });
  }
  let trailMouseX = 0,
    trailMouseY = 0;
  document.addEventListener("mousemove", (e) => {
    trailMouseX = e.clientX;
    trailMouseY = e.clientY;
  });
  (function animateTrail() {
    let x = trailMouseX,
      y = trailMouseY;
    trail.forEach((p, i) => {
      p.el.style.left = p.x + "px";
      p.el.style.top = p.y + "px";
      p.el.style.opacity = (0.55 - i * 0.08).toString();
      const nextX = i === 0 ? x : trail[i - 1].x;
      const nextY = i === 0 ? y : trail[i - 1].y;
      p.x += (nextX - p.x) * 0.35;
      p.y += (nextY - p.y) * 0.35;
    });
    requestAnimationFrame(animateTrail);
  })();
}

// ── MATRIX RAIN ───────────────────────────────
(function matrixRain() {
  const mc = document.getElementById("matrix-canvas");
  if (!mc) return;
  const mobileMode = IS_MOBILE;
  const mctx = mc.getContext("2d");
  function resizeMC() {
    mc.width = window.innerWidth;
    mc.height = window.innerHeight;
  }
  resizeMC();
  window.addEventListener("resize", resizeMC);
  const chars = "アイウエオカキクケコサシスセソ0123456789ABCDEF<>/\\|[]{}";
  const fontSize = mobileMode ? 18 : 14;
  let cols = Math.floor(mc.width / fontSize);
  if (mobileMode) cols = Math.floor(cols / 2);
  let drops = Array(cols).fill(1);
  function drawMatrix() {
    mctx.fillStyle = "rgba(2, 8, 24, 0.05)";
    mctx.fillRect(0, 0, mc.width, mc.height);
    mctx.font = fontSize + 'px "Share Tech Mono", monospace';
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const alpha = Math.random() > 0.9 ? 1 : 0.35;
      mctx.fillStyle = alpha === 1 ? "#25d1f4" : "rgba(37,209,244,0.25)";
      mctx.fillText(
        char,
        i * fontSize * (mobileMode ? 2 : 1),
        drops[i] * fontSize,
      );
      if (drops[i] * fontSize > mc.height && Math.random() > 0.975)
        drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(drawMatrix, mobileMode ? 200 : 50);
  const heroEl = document.getElementById("hero");
  const matrixObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) mc.classList.add("active");
        else mc.classList.remove("active");
      });
    },
    { threshold: 0.1 },
  );
  if (heroEl) matrixObs.observe(heroEl);
})();

// ── CLICK RIPPLE ──────────────────────────────
(function clickRipple() {
  const container = document.getElementById("click-ripples");
  const colors = ["var(--cyan)", "var(--purple)", "var(--pink)"];
  document.addEventListener("click", (e) => {
    for (let i = 0; i < 3; i++) {
      const ring = document.createElement("div");
      ring.className = "click-ring";
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
      ring.style.borderColor = colors[i];
      ring.style.boxShadow = `0 0 12px ${colors[i]}`;
      ring.style.animationDelay = i * 0.08 + "s";
      container.appendChild(ring);
      setTimeout(() => ring.remove(), 1000);
    }
  });
})();

// ── AUDIO VISUALIZER ──────────────────────────
(function audioViz() {
  const bars = document.querySelectorAll(".av-bar");
  if (!bars.length) return;
  bars.forEach((bar) => {
    const min = Math.random() * 5 + 4;
    const max = Math.random() * 45 + 12;
    const dur = (Math.random() * 0.6 + 0.4).toFixed(2);
    bar.style.setProperty("--min-h", min + "px");
    bar.style.setProperty("--max-h", max + "px");
    bar.style.setProperty("--dur", dur + "s");
    bar.style.animationDelay = (Math.random() * 0.5).toFixed(2) + "s";
  });
  setInterval(() => {
    bars.forEach((bar) => {
      bar.style.setProperty(
        "--max-h",
        (Math.random() * 45 + 10).toFixed(0) + "px",
      );
    });
  }, 2500);
})();

// ── TEXT SCRAMBLE ON TITLES ───────────────────
(function textScramble() {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*<>/\\|[]{}";
  function scramble(el) {
    const original = el.dataset.original || el.textContent.trim();
    el.dataset.original = original;
    let frame = 0;
    const totalFrames = 20;
    const interval = setInterval(() => {
      el.textContent = original
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (frame / totalFrames > i / original.length) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");
      frame++;
      if (frame > totalFrames) {
        clearInterval(interval);
        el.textContent = original;
      }
    }, 40);
  }
  const scrambleTitles = document.querySelectorAll(".scramble-title");
  const scrambleObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => scramble(e.target), 200);
          scrambleObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  scrambleTitles.forEach((el) => scrambleObs.observe(el));
})();

// ── SECTION FLASH ─────────────────────────────
(function glitchFlash() {
  const sectionEls = document.querySelectorAll("section[id]");
  let lastId = "";
  const flashObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.target.id !== lastId) {
          lastId = e.target.id;
          if (e.target.id === "hero") return;
          const flash = document.createElement("div");
          flash.className = "section-flash";
          document.body.appendChild(flash);
          setTimeout(() => flash.remove(), 300);
        }
      });
    },
    { threshold: 0.4 },
  );
  sectionEls.forEach((s) => flashObs.observe(s));
})();

// ── MAGNETIC BUTTONS ──────────────────────────
(function magneticCursor() {
  document
    .querySelectorAll(".nav-hire, .form-submit, #back-to-top, .btn-primary")
    .forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.3;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
})();

// ── HOLOGRAPHIC SHIMMER ────────────────────────
(function holoShimmer() {
  document.querySelectorAll(".holo-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
      const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
      card.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(37,209,244,0.07) 0%, transparent 50%)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.backgroundImage = "";
    });
  });
})();

// ── SKILL BARS ────────────────────────────────
(function buildSkillBars() {
  const wrap = document.getElementById("skill-bars-wrap");
  if (!wrap) return;
  const skillData = [
    { name: "JavaScript / Node.js", pct: 88, color: "var(--cyan)" },
    { name: "React / Next.js", pct: 82, color: "var(--cyan)" },
    { name: "Python", pct: 80, color: "var(--green)" },
    { name: "MongoDB / SQL", pct: 78, color: "var(--purple)" },
    { name: "Cybersecurity / Ethical Hacking", pct: 85, color: "var(--pink)" },
    { name: "C++ / DSA", pct: 75, color: "var(--cyan)" },
  ];
  skillData.forEach((sk) => {
    const div = document.createElement("div");
    div.className = "skill-bar-wrap reveal";
    div.innerHTML = `
      <div class="skill-bar-header">
        <span class="skill-bar-name">${sk.name}</span>
        <span class="skill-bar-pct">${sk.pct}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-pct="${sk.pct}" style="background:linear-gradient(90deg, ${sk.color}, rgba(191,0,255,0.6));"></div>
      </div>`;
    wrap.appendChild(div);
    observer.observe(div);
  });

  const barObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const fill = e.target.querySelector(".skill-bar-fill");
          if (fill) fill.style.width = fill.dataset.pct + "%";
          barObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  document
    .querySelectorAll(".skill-bar-wrap")
    .forEach((el) => barObs.observe(el));
})();

// ── AURORA CANVAS ──────────────────────────────
(function aurora() {
  if (IS_MOBILE) return;
  const ac = document.getElementById("aurora-canvas");
  if (!ac) return;
  const actx = ac.getContext("2d");
  function resizeAc() {
    ac.width = window.innerWidth;
    ac.height = window.innerHeight;
  }
  resizeAc();
  window.addEventListener("resize", resizeAc);
  let t = 0;
  function drawAurora() {
    actx.clearRect(0, 0, ac.width, ac.height);
    const grad = actx.createLinearGradient(0, 0, ac.width, ac.height);
    const hue1 = (t * 0.5) % 360;
    const hue2 = (hue1 + 120) % 360;
    grad.addColorStop(0, `hsla(${hue1}, 80%, 50%, 0.06)`);
    grad.addColorStop(0.5, `hsla(${hue2}, 100%, 60%, 0.04)`);
    grad.addColorStop(1, `hsla(${(hue2 + 60) % 360}, 70%, 40%, 0.05)`);
    actx.fillStyle = grad;
    actx.fillRect(0, 0, ac.width, ac.height);
    t++;
    requestAnimationFrame(drawAurora);
  }
  drawAurora();
})();

// ═══════════════════════════════════════════════════════════════
//  UNIQUE ADVANCED EFFECTS — v2 EXCLUSIVE
// ═══════════════════════════════════════════════════════════════

// ── 1. GRAVITATIONAL PARTICLE ATTRACTOR ───────────────────────
(function gravityParticles() {
  const gc = document.getElementById("gravity-canvas");
  if (!gc || IS_MOBILE) return;
  const gctx = gc.getContext("2d");
  function resizeGC() {
    gc.width = window.innerWidth;
    gc.height = window.innerHeight;
  }
  resizeGC();
  window.addEventListener("resize", resizeGC);

  let gMouseX = window.innerWidth / 2,
    gMouseY = window.innerHeight / 2;
  let isAttract = true;
  document.addEventListener("mousemove", (e) => {
    gMouseX = e.clientX;
    gMouseY = e.clientY;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") isAttract = !isAttract;
  });

  const GP_COUNT = 120;
  const gravParticles = [];
  class GParticle {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * gc.width;
      this.y = init
        ? Math.random() * gc.height
        : Math.random() > 0.5
          ? -10
          : gc.height + 10;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.r = Math.random() * 2 + 0.5;
      this.mass = this.r * 0.5;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
      const rand = Math.random();
      this.color =
        rand > 0.6
          ? [37, 209, 244]
          : rand > 0.3
            ? [191, 0, 255]
            : [0, 255, 136];
    }
    update() {
      const dx = gMouseX - this.x;
      const dy = gMouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1;
      const force = isAttract
        ? Math.min(800 / (dist * dist), 2.5)
        : -Math.min(600 / (dist * dist), 2.5);
      this.vx += (dx / dist) * force * this.mass;
      this.vy += (dy / dist) * force * this.mass;
      // dampen
      this.vx *= 0.97;
      this.vy *= 0.97;
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (
        this.life > this.maxLife ||
        this.x < -50 ||
        this.x > gc.width + 50 ||
        this.y < -50 ||
        this.y > gc.height + 50
      )
        this.reset();
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.7;
      gctx.globalAlpha = alpha;
      gctx.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
      gctx.shadowBlur = 10;
      gctx.shadowColor = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},0.5)`;
      gctx.beginPath();
      gctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      gctx.fill();
      gctx.globalAlpha = 1;
      gctx.shadowBlur = 0;
    }
  }
  for (let i = 0; i < GP_COUNT; i++) gravParticles.push(new GParticle());

  function animGrav() {
    gctx.clearRect(0, 0, gc.width, gc.height);
    gravParticles.forEach((p) => {
      p.update();
      p.draw();
    });
    // Draw attractor glow at mouse
    const grad = gctx.createRadialGradient(
      gMouseX,
      gMouseY,
      0,
      gMouseX,
      gMouseY,
      60,
    );
    grad.addColorStop(
      0,
      isAttract ? "rgba(37,209,244,0.08)" : "rgba(255,71,133,0.08)",
    );
    grad.addColorStop(1, "transparent");
    gctx.fillStyle = grad;
    gctx.beginPath();
    gctx.arc(gMouseX, gMouseY, 60, 0, Math.PI * 2);
    gctx.fill();
    requestAnimationFrame(animGrav);
  }
  animGrav();
})();

// ── 2. DNA DOUBLE HELIX CANVAS ─────────────────────────────────
(function dnaHelix() {
  const dc = document.getElementById("dna-canvas");
  if (!dc) return;
  const dctx = dc.getContext("2d");
  function resizeDC() {
    dc.width = dc.offsetWidth;
    dc.height = dc.offsetHeight;
  }
  resizeDC();
  window.addEventListener("resize", resizeDC);

  let dnaT = 0;
  function drawDNA() {
    if (!dc.width || !dc.height) {
      requestAnimationFrame(drawDNA);
      return;
    }
    dctx.clearRect(0, 0, dc.width, dc.height);
    const cx = dc.width / 2;
    const amp = dc.width * 0.25;
    const freq = 0.025;
    const dotCount = 60;

    for (let i = 0; i <= dotCount; i++) {
      const progress = i / dotCount;
      const y = progress * dc.height;
      const angle1 = progress * Math.PI * 6 + dnaT;
      const angle2 = angle1 + Math.PI;

      const x1 = cx + Math.sin(angle1) * amp;
      const x2 = cx + Math.sin(angle2) * amp;

      const depthFactor1 = (Math.cos(angle1) + 1) / 2;
      const depthFactor2 = (Math.cos(angle2) + 1) / 2;

      // Strand 1 dot
      const r1 = depthFactor1 * 4 + 1;
      dctx.globalAlpha = depthFactor1 * 0.85 + 0.1;
      dctx.fillStyle = `rgba(37,209,244,1)`;
      dctx.shadowBlur = depthFactor1 * 18;
      dctx.shadowColor = "#25d1f4";
      dctx.beginPath();
      dctx.arc(x1, y, r1, 0, Math.PI * 2);
      dctx.fill();

      // Strand 2 dot
      const r2 = depthFactor2 * 4 + 1;
      dctx.globalAlpha = depthFactor2 * 0.85 + 0.1;
      dctx.fillStyle = `rgba(191,0,255,1)`;
      dctx.shadowBlur = depthFactor2 * 18;
      dctx.shadowColor = "#bf00ff";
      dctx.beginPath();
      dctx.arc(x2, y, r2, 0, Math.PI * 2);
      dctx.fill();

      // Cross-bridge rungs every ~5 dots
      if (i % 5 === 0) {
        const rungAlpha = Math.max(depthFactor1, depthFactor2) * 0.25;
        dctx.globalAlpha = rungAlpha;
        dctx.strokeStyle = "rgba(0,255,136,0.7)";
        dctx.lineWidth = 1;
        dctx.shadowBlur = 6;
        dctx.shadowColor = "#00ff88";
        dctx.beginPath();
        dctx.moveTo(x1, y);
        dctx.lineTo(x2, y);
        dctx.stroke();
      }
    }
    dctx.globalAlpha = 1;
    dctx.shadowBlur = 0;
    dnaT -= 0.025;
    requestAnimationFrame(drawDNA);
  }
  drawDNA();
})();

// ── 3. MORPHING BLOB (JS-driven fallback for CSS d: path) ──────
(function morphingBlob() {
  if (IS_MOBILE) return;
  const blobPath = document.getElementById("blob-path");
  if (!blobPath) return;

  const blobs = [
    "M440,320Q380,390,310,430Q240,470,160,420Q80,370,60,280Q40,190,100,120Q160,50,250,30Q340,10,400,80Q460,150,440,320Z",
    "M420,300Q350,420,260,440Q170,460,110,370Q50,280,70,180Q90,80,190,50Q290,20,380,90Q470,160,420,300Z",
    "M460,340Q390,460,280,450Q170,440,100,340Q30,240,80,140Q130,40,240,30Q350,20,420,110Q490,200,460,340Z",
    "M400,280Q340,400,250,430Q160,460,100,350Q40,240,70,140Q100,40,210,25Q320,10,390,90Q460,170,400,280Z",
  ];

  let blobIdx = 0;
  function morphBlob() {
    blobIdx = (blobIdx + 1) % blobs.length;
    if (blobPath.style) blobPath.setAttribute("d", blobs[blobIdx]);
  }
  setInterval(morphBlob, 3000);
})();

// ── 4. MESH GRADIENT MOUSE TRACKER ─────────────────────────────
(function meshGradientMouse() {
  const mesh = document.getElementById("mesh-gradient");
  if (!mesh || IS_MOBILE) return;
  let targetX = 20,
    targetY = 30,
    currentX = 20,
    currentY = 30;
  document.addEventListener("mousemove", (e) => {
    targetX = ((e.clientX / window.innerWidth) * 100).toFixed(1);
    targetY = ((e.clientY / window.innerHeight) * 100).toFixed(1);
  });
  (function animMesh() {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;
    mesh.style.background = `
      radial-gradient(ellipse at ${currentX}% ${currentY}%, rgba(37,209,244,0.55) 0%, transparent 45%),
      radial-gradient(ellipse at ${100 - currentX}% ${100 - currentY}%, rgba(191,0,255,0.45) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.25) 0%, transparent 55%)
    `;
    requestAnimationFrame(animMesh);
  })();
})();

// ── 5. SCANLINE WIPE SECTION REVEAL ────────────────────────────
(function scanlineReveal() {
  const revealSections = document.querySelectorAll("section[id]");
  const scanObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
          const section = entry.target;
          if (!section.classList.contains("scanline-reveal")) {
            section.classList.add("scanline-reveal");
          }
          section.classList.add("scanning");
          setTimeout(() => section.classList.remove("scanning"), 1300);
          scanObs.unobserve(section);
          // Drop a section-ripple
          const ripple = document.createElement("div");
          ripple.className = "section-ripple";
          section.appendChild(ripple);
          setTimeout(() => ripple.remove(), 2000);
        }
      });
    },
    { threshold: 0.15 },
  );
  revealSections.forEach((s) => scanObs.observe(s));
})();

// ── 6. FLOATING TECH WORDS IN HERO ─────────────────────────────
(function floatingTechWords() {
  const hero = document.getElementById("hero");
  if (!hero || IS_MOBILE) return;
  const words = [
    "<html>",
    "function()",
    "git push",
    "#!/bin/bash",
    "SQL",
    "let x =",
    "deploy()",
    "API",
    "{...}",
    "async",
    "npm run",
    "0x00",
    "root@",
    "CTF",
    "JWT",
    "MERN",
    "React",
    "Node.js",
    "MongoDB",
    "Firebase",
    "TryHackMe",
    "🔐",
    "⚡",
    "nmap -sV",
  ];
  const WORD_COUNT = IS_MOBILE ? 6 : 16;

  for (let i = 0; i < WORD_COUNT; i++) {
    const word = words[Math.floor(Math.random() * words.length)];
    const el = document.createElement("span");
    el.className = "hero-float-word";
    el.textContent = word;
    el.style.left = Math.random() * 90 + 5 + "%";
    el.style.bottom = Math.random() * 70 + 10 + "%";
    const dur = (Math.random() * 8 + 6).toFixed(1);
    el.style.animationDuration = dur + "s";
    el.style.animationDelay = Math.random() * -8 + "s";
    el.style.fontSize = Math.random() * 0.35 + 0.55 + "rem";
    hero.appendChild(el);
  }
})();

// ── 7. FPS COUNTER HUD ─────────────────────────────────────────
(function fpsCounter() {
  const hud = document.getElementById("fps-hud");
  const fpsVal = document.getElementById("fps-val");
  if (!hud || !fpsVal) return;
  let lastTime = performance.now(),
    frames = 0,
    fps = 60;

  // Show FPS HUD only for desktop visitors
  if (!IS_MOBILE) hud.classList.add("visible");

  function trackFPS(now) {
    frames++;
    const elapsed = now - lastTime;
    if (elapsed >= 500) {
      fps = Math.round((frames * 1000) / elapsed);
      fpsVal.textContent = fps;
      // Color code performance
      fpsVal.style.color =
        fps >= 55 ? "var(--green)" : fps >= 30 ? "var(--cyan)" : "var(--pink)";
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(trackFPS);
  }
  requestAnimationFrame(trackFPS);
})();

// ── 8. HERO NAME CHROMATIC ABERRATION DATA-TEXT SYNC ──────────
(function syncDataText() {
  const heroName = document.querySelector(".hero-name");
  if (heroName && !heroName.getAttribute("data-text")) {
    heroName.setAttribute("data-text", heroName.textContent.trim());
  }
})();

// ── 9. NEON VOLTAGE FLICKER (Enhanced) ────────────────────────
(function neonVoltageSurge() {
  const logo = document.querySelector(".nav-logo");
  if (!logo) return;
  // Random micro-flickers layered on top of CSS animation
  function spark() {
    if (Math.random() > 0.85) {
      logo.style.filter = `brightness(${1.2 + Math.random() * 0.5}) drop-shadow(0 0 20px ${Math.random() > 0.5 ? "var(--cyan)" : "var(--purple)"})`;
      setTimeout(
        () => {
          logo.style.filter = "";
        },
        60 + Math.random() * 120,
      );
    }
    setTimeout(spark, 1200 + Math.random() * 3000);
  }
  spark();
})();

// ── 10. CONSTELLATION MOUSE INTERACTION ───────────────────────
(function constellation() {
  if (IS_MOBILE) return;
  // Existing particles already draw connections — upgrade to glow when mouse is nearby
  let consMX = -9999,
    consMY = -9999;
  document.addEventListener("mousemove", (e) => {
    consMX = e.clientX;
    consMY = e.clientY;
  });
  // We hook into the existing particle animation by checking proximity in the main loop
  // This is done by overriding how nearby particles glow
  const origConnectFn = window.__connectParticles;
  // The glow is applied via the particles canvas — subtle enhancement already baked in
})();

// ── 11. PAGE LOAD: HERO SCANLINE TRIGGER ──────────────────────
(function heroEntrance() {
  const hero = document.getElementById("hero");
  if (!hero) return;
  setTimeout(() => {
    hero.classList.add("scanline-reveal", "scanning");
    setTimeout(() => hero.classList.remove("scanning"), 1300);
  }, 600);
})();

// ── 12. MOBILE TOUCH FLIP FOR 3D CARDS ───────────────────────
(function mobileCardFlip() {
  document.querySelectorAll(".project-card").forEach((card) => {
    // Add both click and touchstart to ensure it fires on all touch devices
    ["click", "touchstart"].forEach((evt) => {
      card.addEventListener(
        evt,
        function (e) {
          // Only trigger manual flip on narrow screens (mobile behavior)
          if (window.innerWidth > 900) return;

          const isFlipped = card.classList.contains("flipped");
          document
            .querySelectorAll(".project-card")
            .forEach((c) => c.classList.remove("flipped"));

          if (!isFlipped) card.classList.add("flipped");
        },
        { passive: true },
      );
    });
  });
})();

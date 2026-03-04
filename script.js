// ── SERVICE WORKER REGISTRATION ──────────────
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((reg) => console.log("[SW] Registered:", reg.scope))
      .catch((err) => console.warn("[SW] Registration failed:", err));
  });
}

// ── OFFLINE / ONLINE BANNER ───────────────────
const offlineBanner = document.getElementById("offline-banner");
function updateOnlineStatus() {
  if (!navigator.onLine) {
    offlineBanner.classList.add("visible");
  } else {
    offlineBanner.classList.remove("visible");
  }
}
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus(); // run on first load in case already offline

// ── SCROLL PROGRESS BAR ──────────────────────
const progressBar = document.getElementById("scroll-progress");
window.addEventListener(
  "scroll",
  () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight) * 100 + "%";
  },
  { passive: true },
);

// ── HAMBURGER MENU ───────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
// Close menu when a nav link is clicked
navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// ── CUSTOM CURSOR ────────────────────────────
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
let mouseX = 0,
  mouseY = 0,
  ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + "px";
  dot.style.top = mouseY + "px";
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.1;
  ringY += (mouseY - ringY) * 0.1;
  ring.style.left = ringX + "px";
  ring.style.top = ringY + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

document
  .querySelectorAll(
    "a, button, .skill-tag, .project-card, .achieve-card, .cert-card, .contact-link, .stat-card",
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
      ring.style.borderColor = "rgba(0,245,255,0.6)";
    });
  });

// ── NAV SCROLL ──────────────────────────────
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

// ── PARTICLE CANVAS ──────────────────────────
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const PARTICLE_COUNT = 90;
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
    this.color = Math.random() > 0.7 ? [191, 0, 255] : [0, 245, 255];
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

// Connecting lines between close particles
function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.12;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "#00f5ff";
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
  connectParticles();
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

// ── SCROLL REVEAL ────────────────────────────
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
);
reveals.forEach((el) => observer.observe(el));

// ── STAGGER REVEALS ─────────────────────────
document.querySelectorAll(".stagger > *").forEach((el, i) => {
  el.style.transitionDelay = i * 0.1 + "s";
  el.classList.add("reveal");
  observer.observe(el);
});

// ── GLITCH RANDOM TRIGGER ───────────────────
const heroName = document.querySelector(".hero-name");
setInterval(() => {
  if (Math.random() < 0.3) {
    heroName.style.animation = "none";
    void heroName.offsetHeight;
    heroName.style.animation = "";
  }
}, 4000);

// ── SMOOTH NAV CLICK ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// ── SKILL TAG RIPPLE ─────────────────────────
document.querySelectorAll(".skill-tag").forEach((tag) => {
  tag.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(0,245,255,0.3);width:60px;height:60px;transform:translate(-50%,-50%) scale(0);animation:ripple 0.6s ease-out forwards;left:${e.offsetX}px;top:${e.offsetY}px;pointer-events:none`;
    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// inject ripple keyframe
const style = document.createElement("style");
style.textContent =
  "@keyframes ripple{to{transform:translate(-50%,-50%) scale(3);opacity:0}}";
document.head.appendChild(style);

// ── COUNTER ANIMATION ────────────────────────
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

// ── TILT ON CARDS ────────────────────────────
document.querySelectorAll(".project-card, .achieve-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2,
      cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transformStyle = "preserve-3d";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transformStyle = "";
  });
});

// ── ACTIVE NAV HIGHLIGHT ─────────────────────
const sections = document.querySelectorAll("section[id]");
const navLinksAll = document.querySelectorAll(".nav-links a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinksAll.forEach((a) => (a.style.color = ""));
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

// ── CONTACT FORM AJAX ─────────────────────────
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector(".form-submit");
    const originalText = btn.textContent;

    // Show loading state
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
        // Replace form with success message
        contactForm.innerHTML = `
          <div style="text-align:center;padding:40px 20px;">
            <div style="font-size:3rem;margin-bottom:16px;">✅</div>
            <div style="font-family:'Orbitron',sans-serif;font-size:1.1rem;color:var(--cyan);
                        text-shadow:0 0 20px var(--cyan);letter-spacing:0.1em;margin-bottom:12px;">
              MESSAGE SENT!
            </div>
            <p style="color:rgba(200,216,232,0.7);font-family:'Rajdhani',sans-serif;font-size:1rem;">
              Thanks for reaching out. I'll get back to you soon.
            </p>
          </div>`;
      } else {
        // Restore button + show error
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
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ── CURSOR PARTICLE TRAIL ─────────────────────
const TRAIL_COUNT = 6;
const trailColors = [
  "#00f5ff",
  "#bf00ff",
  "#ff006e",
  "#00ff88",
  "#0066ff",
  "#00f5ff",
];
const trail = [];

for (let i = 0; i < TRAIL_COUNT; i++) {
  const p = document.createElement("div");
  p.className = "cursor-particle";
  const size = 6 - i * 0.7;
  p.style.cssText = `width:${size}px;height:${size}px;background:${trailColors[i]};opacity:0;`;
  document.body.appendChild(p);
  trail.push({ el: p, x: 0, y: 0 });
}

let trailMouseX = 0,
  trailMouseY = 0;
document.addEventListener("mousemove", (e) => {
  trailMouseX = e.clientX;
  trailMouseY = e.clientY;
});

function animateTrail() {
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
}
animateTrail();

// ═══════════════════════════════════════════════════════════════
//  UNIQUE EFFECTS EXTENSION
// ═══════════════════════════════════════════════════════════════

// ── 1. MATRIX DIGITAL RAIN ────────────────────
(function matrixRain() {
  const mc = document.getElementById("matrix-canvas");
  const mctx = mc.getContext("2d");
  function resizeMC() {
    mc.width = window.innerWidth;
    mc.height = window.innerHeight;
  }
  resizeMC();
  window.addEventListener("resize", resizeMC);

  const chars =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEF<>/\\|[]{}";
  const fontSize = 14;
  let cols = Math.floor(mc.width / fontSize);
  let drops = Array(cols).fill(1);

  function drawMatrix() {
    mctx.fillStyle = "rgba(2, 8, 24, 0.05)";
    mctx.fillRect(0, 0, mc.width, mc.height);
    mctx.font = fontSize + 'px "Share Tech Mono", monospace';
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const alpha = Math.random() > 0.9 ? 1 : 0.4;
      mctx.fillStyle = alpha === 1 ? "#00f5ff" : "rgba(0,245,255,0.3)";
      mctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > mc.height && Math.random() > 0.975)
        drops[i] = 0;
      drops[i]++;
    }
    window.addEventListener("resize", () => {
      cols = Math.floor(mc.width / fontSize);
      drops = Array(cols).fill(1);
    });
  }

  setInterval(drawMatrix, 50);

  // Activate after hero is scrolled past
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

// ── 2. CLICK NEON RIPPLE ──────────────────────
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

// ── 3. AUDIO VISUALIZER ───────────────────────
(function audioViz() {
  const bars = document.querySelectorAll(".av-bar");
  if (!bars.length) return;
  bars.forEach((bar, i) => {
    const min = Math.random() * 5 + 4;
    const max = Math.random() * 45 + 12;
    const dur = (Math.random() * 0.6 + 0.4).toFixed(2);
    bar.style.setProperty("--min-h", min + "px");
    bar.style.setProperty("--max-h", max + "px");
    bar.style.setProperty("--dur", dur + "s");
    bar.style.animationDelay = (Math.random() * 0.5).toFixed(2) + "s";
  });
  // Randomise heights periodically for organic feel
  setInterval(() => {
    bars.forEach((bar) => {
      const max = (Math.random() * 45 + 10).toFixed(0);
      bar.style.setProperty("--max-h", max + "px");
    });
  }, 2500);
})();

// ── 4. TEXT SCRAMBLE ON SECTION TITLES ───────
(function textScramble() {
  const CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*<>/\\|[]{}";

  function scramble(el) {
    const original = el.dataset.original || el.textContent.trim();
    el.dataset.original = original;
    el.classList.add("scrambling");
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
        el.classList.remove("scrambling");
        el.classList.add("done");
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

// ── 5. GLITCH SECTION TRANSITION FLASH ───────
(function glitchFlash() {
  const sectionEls = document.querySelectorAll("section[id]");
  let lastId = "";
  const flashObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.target.id !== lastId) {
          lastId = e.target.id;
          if (e.target.id === "hero") return; // skip hero
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

// ── 6. MAGNETIC CURSOR ATTRACTION ────────────
(function magneticCursor() {
  const MAG_SELECTORS =
    ".nav-hire, .form-submit, #back-to-top, .contact-link, .hero-badge";
  document.querySelectorAll(MAG_SELECTORS).forEach((el) => {
    el.classList.add("mag-btn");
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
})();

// ── 7. HOLOGRAPHIC SHIMMER MOUSE TRACKER ─────
(function holoShimmer() {
  document.querySelectorAll(".holo-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
      const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
      card.style.setProperty("--mx", x + "%");
      card.style.setProperty("--my", y + "%");
      card.querySelector(":scope > *:not(.holo-card::before)");
      // Update the pseudo shine direction dynamically via CSS var
      card.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(0,245,255,0.07) 0%, transparent 50%)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.backgroundImage = "";
    });
  });
})();

// ── 8. LIQUID SKILL BARS INJECTION ───────────
(function liquidSkillBars() {
  const skillsSection = document.getElementById("skills");
  if (!skillsSection) return;

  const skillData = [
    { name: "JavaScript / Node.js", pct: 88, color: "var(--cyan)" },
    { name: "React / Next.js", pct: 82, color: "var(--cyan)" },
    { name: "Python", pct: 80, color: "var(--green)" },
    { name: "MongoDB / SQL", pct: 78, color: "var(--purple)" },
    { name: "Cybersecurity / Ethical Hacking", pct: 85, color: "var(--pink)" },
    { name: "C++ / DSA", pct: 75, color: "var(--cyan)" },
  ];

  const existing = skillsSection.querySelector(".container");
  if (!existing) return;

  const barContainer = document.createElement("div");
  barContainer.style.cssText = "margin-top:48px;";
  barContainer.innerHTML =
    '<div class="section-tag" style="margin-bottom:24px;">⚡ PROFICIENCY LEVELS</div>';

  skillData.forEach((sk) => {
    const wrap = document.createElement("div");
    wrap.className = "skill-bar-wrap reveal";
    wrap.innerHTML = `
      <div class="skill-bar-label">
        <span>${sk.name}</span>
        <span>${sk.pct}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-pct="${sk.pct}"
             style="background:linear-gradient(90deg,${sk.color},var(--purple));box-shadow:0 0 12px ${sk.color};">
        </div>
      </div>`;
    barContainer.appendChild(wrap);
  });

  existing.appendChild(barContainer);

  // Animate bars when visible
  const barObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".skill-bar-fill").forEach((fill) => {
            setTimeout(() => {
              fill.style.width = fill.dataset.pct + "%";
            }, 100);
          });
          barObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 },
  );
  barObs.observe(barContainer);

  // Also wire up newly added reveals
  barContainer
    .querySelectorAll(".reveal")
    .forEach((el) => observer.observe(el));
})();

// ── 10. PARALLAX FLOATING ORBS ON ABOUT ──────
(function parallaxAbout() {
  document.addEventListener("mousemove", (e) => {
    const dx = (e.clientX / window.innerWidth - 0.5) * 25;
    const dy = (e.clientY / window.innerHeight - 0.5) * 25;
    document.querySelectorAll(".blob").forEach((blob, i) => {
      const factor = (i + 1) * 0.4;
      blob.style.transform = `translate(${dx * factor}px, ${dy * factor}px) scale(1)`;
    });
  });
})();

// ═══════════════════════════════════════════════════════════════
//  DRAMATIC BACKGROUND EFFECTS
// ═══════════════════════════════════════════════════════════════

// ── A. AURORA BOREALIS ────────────────────────
(function aurora() {
  const ac = document.getElementById("aurora-canvas");
  const ctx = ac.getContext("2d");

  function resize() {
    ac.width = window.innerWidth;
    ac.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Define multiple undulating ribbon configs
  const ribbons = [
    {
      baseY: 0.22,
      amp: 0.12,
      freq: 0.0008,
      speed: 0.00018,
      phase: 0,
      colors: [
        "rgba(0,245,255,0)",
        "rgba(0,245,255,0.18)",
        "rgba(0,200,255,0.12)",
        "rgba(0,245,255,0)",
      ],
    },
    {
      baseY: 0.3,
      amp: 0.09,
      freq: 0.0012,
      speed: 0.00022,
      phase: 2.1,
      colors: [
        "rgba(191,0,255,0)",
        "rgba(191,0,255,0.15)",
        "rgba(130,0,255,0.10)",
        "rgba(191,0,255,0)",
      ],
    },
    {
      baseY: 0.18,
      amp: 0.07,
      freq: 0.0015,
      speed: 0.00015,
      phase: 4.3,
      colors: [
        "rgba(0,255,136,0)",
        "rgba(0,255,136,0.12)",
        "rgba(0,200,100,0.08)",
        "rgba(0,255,136,0)",
      ],
    },
    {
      baseY: 0.35,
      amp: 0.1,
      freq: 0.0009,
      speed: 0.0002,
      phase: 1.0,
      colors: [
        "rgba(255,0,110,0)",
        "rgba(255,0,110,0.10)",
        "rgba(200,0,90,0.07)",
        "rgba(255,0,110,0)",
      ],
    },
    {
      baseY: 0.14,
      amp: 0.06,
      freq: 0.0018,
      speed: 0.00025,
      phase: 3.5,
      colors: [
        "rgba(0,102,255,0)",
        "rgba(0,150,255,0.13)",
        "rgba(0,102,255,0.09)",
        "rgba(0,102,255,0)",
      ],
    },
  ];

  let t = 0;

  function drawRibbon(r) {
    const W = ac.width,
      H = ac.height;
    const ribbonHeight = H * 0.08;
    ctx.beginPath();

    // Build wave path top edge
    for (let x = 0; x <= W; x += 4) {
      const y =
        r.baseY * H +
        Math.sin(x * r.freq + t * r.speed + r.phase) * r.amp * H +
        Math.sin(x * r.freq * 2.3 + t * r.speed * 1.7) * r.amp * H * 0.3;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    // Bottom edge (wave + extra height)
    for (let x = W; x >= 0; x -= 4) {
      const y =
        r.baseY * H +
        Math.sin(x * r.freq + t * r.speed + r.phase) * r.amp * H +
        Math.sin(x * r.freq * 2.3 + t * r.speed * 1.7) * r.amp * H * 0.3 +
        ribbonHeight;
      ctx.lineTo(x, y);
    }
    ctx.closePath();

    // Vertical color gradient
    const grad = ctx.createLinearGradient(
      0,
      r.baseY * H - 10,
      0,
      r.baseY * H + ribbonHeight + 10,
    );
    r.colors.forEach((c, i) => grad.addColorStop(i / (r.colors.length - 1), c));
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function animateAurora() {
    ctx.clearRect(0, 0, ac.width, ac.height);
    // Slight fade trail for smooth blending
    ctx.fillStyle = "rgba(2,8,24,0.08)";
    ctx.fillRect(0, 0, ac.width, ac.height);
    ribbons.forEach(drawRibbon);
    t++;
    requestAnimationFrame(animateAurora);
  }

  animateAurora();
})();

// ── B. SHOOTING STARS ────────────────────────
(function shootingStars() {
  function spawnStar() {
    const star = document.createElement("div");
    star.className = "shooting-star";
    const startX = Math.random() * window.innerWidth * 0.6;
    const startY = Math.random() * window.innerHeight * 0.4;
    const length = Math.random() * 120 + 80;
    const duration = Math.random() * 0.9 + 0.5;
    const angle = Math.random() * 20 + 25; // degrees

    star.style.cssText = `
      left: ${startX}px;
      top:  ${startY}px;
      width: ${length}px;
      transform: rotate(${angle}deg);
      animation-duration: ${duration}s;
    `;
    document.body.appendChild(star);
    setTimeout(() => star.remove(), duration * 1000 + 100);
  }

  // Spawn stars randomly with varying intervals
  function scheduleNext() {
    const delay = Math.random() * 3500 + 800;
    setTimeout(() => {
      spawnStar();
      // Sometimes spawn a second star right after
      if (Math.random() > 0.6) {
        setTimeout(spawnStar, Math.random() * 300 + 100);
      }
      scheduleNext();
    }, delay);
  }
  scheduleNext();
})();

// ── C. ANIMATED HEX GRID ─────────────────────
(function hexGrid() {
  const hc = document.getElementById("hex-canvas");
  const ctx = hc.getContext("2d");

  function resize() {
    hc.width = window.innerWidth;
    hc.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const HEX_SIZE = 38;
  const HEX_W = HEX_SIZE * 2;
  const HEX_H = Math.sqrt(3) * HEX_SIZE;

  function hexPoints(cx, cy, size) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      pts.push([cx + size * Math.cos(angle), cy + size * Math.sin(angle)]);
    }
    return pts;
  }

  let scrollY = 0;
  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
    },
    { passive: true },
  );

  // Track mouse for hex glow
  let mx = -9999,
    my = -9999;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  let hTime = 0;

  function drawHex() {
    ctx.clearRect(0, 0, hc.width, hc.height);

    const cols = Math.ceil(hc.width / (HEX_W * 0.75)) + 2;
    const rows = Math.ceil(hc.height / HEX_H) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx = col * HEX_W * 0.75;
        const cy = row * HEX_H + (col % 2 === 0 ? 0 : HEX_H / 2);

        // Distance from mouse
        const dist = Math.hypot(cx - mx, cy - my);
        const proximity = Math.max(0, 1 - dist / 220);

        // Pulse based on time + position
        const pulse =
          Math.sin(hTime * 0.012 + col * 0.5 + row * 0.7) * 0.5 + 0.5;

        const baseAlpha = 0.04 + pulse * 0.04 + proximity * 0.25;
        const borderAlpha = 0.08 + pulse * 0.06 + proximity * 0.5;

        const pts = hexPoints(cx, cy, HEX_SIZE - 2);
        ctx.beginPath();
        pts.forEach(([x, y], i) =>
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y),
        );
        ctx.closePath();

        // Fill
        if (proximity > 0.1) {
          const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, HEX_SIZE);
          grad.addColorStop(0, `rgba(0,245,255,${proximity * 0.15})`);
          grad.addColorStop(1, `rgba(191,0,255,${proximity * 0.05})`);
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = `rgba(0,245,255,${baseAlpha})`;
        }
        ctx.fill();

        // Border
        ctx.strokeStyle =
          proximity > 0.1
            ? `rgba(0,245,255,${borderAlpha})`
            : `rgba(0,245,255,${borderAlpha * 0.6})`;
        ctx.lineWidth = proximity > 0.1 ? 1.5 : 0.5;
        ctx.stroke();

        // Glow dot in center of nearby hexes
        if (proximity > 0.4) {
          ctx.beginPath();
          ctx.arc(cx, cy, proximity * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,245,255,${proximity * 0.8})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(0,245,255,0.8)";
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    hTime++;
    requestAnimationFrame(drawHex);
  }

  drawHex();
})();

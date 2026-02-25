// ── TERMINAL LOADER ──────────────────────────
// Only show on first visit; skip on refresh (sessionStorage flag)
if (sessionStorage.getItem("loaderDone")) {
  document.getElementById("loader").remove();
}

const terminalLines = [
  {
    text: "loading abhay.portfolio@v2.0...",
    delay: 60,
    done: "✓ profile loaded",
  },
  { text: "compiling projects [3/3]...", delay: 55, done: "✓ projects ready" },
  { text: "connecting to cyberspace...", delay: 50, done: "✓ online" },
  { text: "ACCESS GRANTED — welcome.", delay: 45, done: null },
];

(function runTerminal() {
  const body = document.getElementById("terminal-body");
  const typingEl = document.getElementById("t-typing");
  const caret = document.querySelector(".t-caret");
  let lineIdx = 0;

  function typeLine(line, onDone) {
    let i = 0;
    typingEl.textContent = "";
    const interval = setInterval(() => {
      typingEl.textContent += line.text[i++];
      if (i === line.text.length) {
        clearInterval(interval);
        setTimeout(() => onDone(), 400);
      }
    }, line.delay);
  }

  function addDoneLine(text, isGrant) {
    const div = document.createElement("div");
    div.className = "t-line done";
    div.innerHTML = `<span class="t-prompt">${isGrant ? "" : "> "}</span><span class="${isGrant ? "" : "t-success"}">${text}</span>`;
    body.insertBefore(div, document.getElementById("t-cursor"));
  }

  function nextLine() {
    if (lineIdx >= terminalLines.length) {
      caret.style.display = "none";
      setTimeout(() => {
        const loader = document.getElementById("loader");
        if (loader) {
          loader.style.transition = "opacity 0.8s ease";
          loader.style.opacity = "0";
          setTimeout(() => {
            loader.remove();
            sessionStorage.setItem("loaderDone", "1");
          }, 800);
        }
      }, 600);
      return;
    }
    const line = terminalLines[lineIdx++];
    typeLine(line, () => {
      if (line.done) {
        addDoneLine(line.done, line.done.startsWith("ACCESS"));
      } else {
        addDoneLine("ACCESS GRANTED — welcome.", true);
      }
      typingEl.textContent = "";
      setTimeout(nextLine, 300);
    });
  }

  window.addEventListener("load", () => setTimeout(nextLine, 400));
})();

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

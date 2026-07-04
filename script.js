const progress = document.querySelector("#progress");
const menuButton = document.querySelector("#menu-button");
const navLinks = document.querySelector("#nav-links");

function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    const target = Number(element.dataset.target);
    const isDecimal = !Number.isInteger(target);
    const start = performance.now();
    const duration = 950;

    function frame(now) {
      const progressValue = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      const value = target * eased;
      element.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
      if (progressValue < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
    counterObserver.unobserve(element);
  });
}, { threshold: 0.35 });

counters.forEach((counter) => counterObserver.observe(counter));

const canvas = document.querySelector("#signal-canvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let nodes = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(70, Math.max(28, Math.floor(width / 22)));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
  }));
}

function drawCanvas() {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  nodes.forEach((node, index) => {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;

    for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
      const other = nodes[nextIndex];
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 130) {
        const alpha = (1 - distance / 130) * 0.34;
        ctx.strokeStyle = `rgba(110, 231, 249, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }

    ctx.fillStyle = "rgba(163, 230, 53, 0.55)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, 1.4, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawCanvas);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(drawCanvas);

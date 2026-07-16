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
let chips = [];
let pulses = [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  const chipSize = Math.min(190, Math.max(118, width * 0.12));
  chips = [
    { x: width * 0.1, y: height * 0.2, size: chipSize * 0.92, label: "NPU", rotation: -0.08 },
    { x: width * 0.88, y: height * 0.22, size: chipSize * 0.78, label: "AI", rotation: 0.08 },
    { x: width * 0.16, y: height * 0.78, size: chipSize * 0.7, label: "AI", rotation: 0.06 },
    { x: width * 0.84, y: height * 0.72, size: chipSize, label: "GPU", rotation: -0.06 },
    { x: width * 0.52, y: height * 0.9, size: chipSize * 0.58, label: "NPU", rotation: 0 },
  ];
  pulses = Array.from({ length: 6 }, (_, index) => ({
    nodeIndex: Math.floor((index / 6) * nodes.length),
    phase: index / 6,
  }));
}

function drawChip(chip, time) {
  const half = chip.size / 2;
  const pinCount = 6;
  const pulse = reduceMotion ? 0.5 : (Math.sin(time * 0.0015) + 1) / 2;

  ctx.save();
  ctx.translate(chip.x, chip.y);
  ctx.rotate(chip.rotation || 0);
  ctx.strokeStyle = `rgba(223, 246, 255, ${0.18 + pulse * 0.08})`;
  ctx.fillStyle = "rgba(8, 35, 66, 0.22)";
  ctx.lineWidth = 1.2;
  ctx.shadowColor = "rgba(110, 231, 249, 0.2)";
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.roundRect(-half, -half, chip.size, chip.size, 12);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(110, 231, 249, 0.2)";
  for (let trace = 0; trace < 4; trace += 1) {
    const y = -half * 0.48 + trace * half * 0.32;
    ctx.beginPath();
    ctx.moveTo(-half * 0.92, y);
    ctx.lineTo(-half * 0.72, y);
    ctx.lineTo(-half * 0.58, y + (trace % 2 ? 8 : -8));
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.strokeRect(-half * 0.66, -half * 0.66, chip.size * 0.66, chip.size * 0.66);

  for (let index = 0; index < pinCount; index += 1) {
    const offset = -half * 0.7 + (index * chip.size * 1.4) / (pinCount - 1);
    [
      [-half - 10, offset, -half, offset],
      [half, offset, half + 10, offset],
      [offset, -half - 10, offset, -half],
      [offset, half, offset, half + 10],
    ].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  }

  // Neural-engine motif inside the package.
  const neurons = [
    [-24, -18], [0, -28], [25, -15],
    [-30, 12], [0, 2], [28, 14], [2, 28],
  ];
  ctx.strokeStyle = "rgba(110, 231, 249, 0.22)";
  neurons.forEach((from, index) => {
    neurons.slice(index + 1).forEach((to) => {
      if (Math.hypot(from[0] - to[0], from[1] - to[1]) < 38) {
        ctx.beginPath();
        ctx.moveTo(from[0], from[1]);
        ctx.lineTo(to[0], to[1]);
        ctx.stroke();
      }
    });
  });
  neurons.forEach(([x, y], index) => {
    ctx.fillStyle = index === 4
      ? `rgba(255, 255, 255, ${0.42 + pulse * 0.22})`
      : "rgba(110, 231, 249, 0.42)";
    ctx.beginPath();
    ctx.arc(x, y, index === 4 ? 3.2 : 2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
  ctx.font = `600 ${Math.max(11, chip.size * 0.1)}px "JetBrains Mono", monospace`;
  ctx.textAlign = "center";
  ctx.fillText(chip.label, 0, half * 0.77);
  ctx.restore();
}

function drawCanvas(time = 0) {
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  chips.forEach((chip) => drawChip(chip, time));

  nodes.forEach((node, index) => {
    if (!reduceMotion) {
      node.x += node.vx;
      node.y += node.vy;
    }

    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;

    for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
      const other = nodes[nextIndex];
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 130) {
        const alpha = (1 - distance / 130) * 0.3;
        ctx.strokeStyle = `rgba(110, 231, 249, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }

    ctx.fillStyle = "rgba(223, 246, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, 1.4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Bright packets suggest activations moving through the neural fabric.
  pulses.forEach((packet, index) => {
    const node = nodes[packet.nodeIndex % nodes.length];
    const glow = reduceMotion ? 0.6 : (Math.sin(time * 0.002 + packet.phase * Math.PI * 2) + 1) / 2;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.16 + glow * 0.48})`;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 2.2 + glow * 1.8, 0, Math.PI * 2);
    ctx.fill();
    if (!reduceMotion && time % 1200 < 20) {
      packet.nodeIndex = (packet.nodeIndex + 7 + index) % nodes.length;
    }
  });

  if (!reduceMotion) requestAnimationFrame(drawCanvas);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
if (reduceMotion) drawCanvas();
else requestAnimationFrame(drawCanvas);

// --- Confetti celebration ---
function burstConfetti(x = window.innerWidth / 2, y = 120, n = 80) {
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    left: 0,
    top: 0,
    width: '100%',
    height: 0,
    pointerEvents: 'none',
    zIndex: 9999
  });
  document.body.appendChild(container);

  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.textContent = '•';
    p.style.position = 'absolute';
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.fontSize = `${Math.random() * 16 + 8}px`;
    p.style.color = ['#3b82f6','#10b981','#f59e0b','#ef4444'][Math.floor(Math.random()*4)];
    container.appendChild(p);

    const dx = (Math.random() - 0.5) * 500;
    const dy = (Math.random() - 0.5) * 300;
    const duration = 1000 + Math.random() * 1200;

    p.animate(
      [
        { transform: 'translate(0,0)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 }
      ],
      { duration, easing: 'cubic-bezier(.2,.8,.2,1)' }
    ).onfinish = () => p.remove();
  }

  setTimeout(() => container.remove(), 1800);
}

document.getElementById('celebrateBtn').addEventListener('click', () => burstConfetti());

// --- Gallery lightbox ---
document.querySelectorAll('.lightbox-trigger').forEach(img => {
  img.addEventListener('click', () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');

    lightbox.style.display = 'block';
    lightboxImg.src = img.dataset.full;
    caption.textContent = img.alt;
  });
});

document.querySelector('.lightbox .close').addEventListener('click', () => {
  document.getElementById('lightbox').style.display = 'none';
});

// Close lightbox when clicking outside the image
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') {
    document.getElementById('lightbox').style.display = 'none';
  }
});

// Close lightbox with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.getElementById('lightbox').style.display = 'none';
  }
});

// --- Sticky note reveal ---
const sticky = document.querySelector('.sticky');

function revealSticky() {
  const triggerBottom = window.innerHeight * 0.85;
  const boxTop = sticky.getBoundingClientRect().top;
  if (boxTop < triggerBottom) {
    sticky.classList.add('show');
    window.removeEventListener('scroll', revealSticky); // run once
  }
}

window.addEventListener('scroll', revealSticky);
window.addEventListener('load', revealSticky);

// --- Quote Carousel (fade version) ---
document.addEventListener('DOMContentLoaded', () => {
  const quotes = document.querySelectorAll('.quote-carousel blockquote');
  const prevBtn = document.querySelector('.nav.prev');
  const nextBtn = document.querySelector('.nav.next');
  const dots = document.querySelectorAll('.dot');

  let index = 0;
  let autoSlideId = null;
  const DURATION = 6000;

  function showQuote(i) {
    quotes.forEach(q => q.classList.remove('active'));
    quotes[i].classList.add('active');

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[i]) dots[i].classList.add('active');
  }

  function nextQuote() {
    index = (index + 1) % quotes.length;
    showQuote(index);
  }

  function prevQuote() {
    index = (index - 1 + quotes.length) % quotes.length;
    showQuote(index);
  }

  function startAuto() {
    stopAuto();
    autoSlideId = setInterval(nextQuote, DURATION);
  }
  function stopAuto() {
    if (autoSlideId) clearInterval(autoSlideId);
    autoSlideId = null;
  }

  // Arrow controls
  nextBtn.addEventListener('click', () => {
    stopAuto();
    nextQuote();
    startAuto();
  });
  prevBtn.addEventListener('click', () => {
    stopAuto();
    prevQuote();
    startAuto();
  });

  // Dot navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      index = i;
      showQuote(index);
      startAuto();
    });
  });

  // Init
  showQuote(index);
  startAuto();
});

let cy;
let current = "0dox";

Promise.all([
  fetch("assets/networks/0dox.json").then(r => r.json()),
  fetch("assets/networks/5dox.json").then(r => r.json())
]).then(([net0, net5]) => {

  function loadNetwork(data) {
    if (cy) {
      cy.destroy();
    }
console.log("Loaded network:", data);
    cy = cytoscape({
      container: document.getElementById("cy"),
      elements: data.elements,
      style: [
{
  selector: "node",
  style: {
    "background-color": "data(color)",
    "label": "data(label)",
    "font-size": "8px",
    "width": "data(size)",
    "height": "data(size)",
    "text-valign": "center",
    "color": "#333",
    "title": function(ele) {
      const d = ele.data();
      return `${d.label}
logFC: ${d.logFC ?? "n/a"}
Motif: ${d.motif ?? "n/a"}
${d.description ?? ""}`;
    }
  }
}

{
  selector: "edge",
  style: {
    "line-color": "#888",
    "target-arrow-shape": "triangle",
    "target-arrow-color": "#555",
    "curve-style": "bezier",
"width": "mapData(strength, 0, 1, 1, 6)"
    "arrow-scale": 1.4,
    "opacity": 0.9
  }
}

      ],
layout: {
  name: "concentric",
  animate: true,
  animationDuration: 800,

  // Bigger nodes closer to the center
  concentric: node => node.data("size"),

  // Controls spacing between rings
  levelWidth: () => 10,

  // Nice spacing
  minNodeSpacing: 20
}
    });
  }

  // Load initial network
  loadNetwork(net0);

  // Toggle button
  document.getElementById("toggle-network").addEventListener("click", () => {
    if (current === "0dox") {
      current = "5dox";
      loadNetwork(net5);
      document.getElementById("toggle-network").textContent = "Switch to 0Dox";
    } else {
      current = "0dox";
      loadNetwork(net0);
      document.getElementById("toggle-network").textContent = "Switch to 5Dox";
    }
  });
});

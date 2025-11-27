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

// --- Quote carousel (optional if you add quotes) ---
let idx = 0;
const quotes = Array.from(document.querySelectorAll('.quote'));
if (quotes.length > 0) {
  setInterval(() => {
    quotes[idx].classList.remove('active');
    idx = (idx + 1) % quotes.length;
    quotes[idx].classList.add('active');
  }, 4000);
}

// --- Gallery lightbox (optional if you add gallery images) ---
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.className = 'lightbox';
lightbox.innerHTML = '<img id="lightboxImg" alt="">';
document.body.appendChild(lightbox);

const lightboxImg = document.getElementById('lightboxImg');

document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('show');
  });
});

lightbox.addEventListener('click', () => lightbox.classList.remove('show'));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') lightbox.classList.remove('show');
});

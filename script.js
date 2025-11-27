function burstConfetti() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.textContent = '✨';
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = Math.random() * window.innerHeight + 'px';
    confetti.style.fontSize = '20px';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

document.getElementById('celebrateBtn').addEventListener('click', burstConfetti);

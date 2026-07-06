// Scroll-reveal
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

// Animated stat counters
const statEls = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const decimals = parseInt(el.dataset.decimal || '0', 10);
    const divisor = Math.pow(10, decimals);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals > 0
        ? (value / divisor).toFixed(decimals)
        : Math.round(value).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.4 });
statEls.forEach((el) => countObserver.observe(el));

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Save-for-later interactions
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

document.querySelectorAll('[data-fav]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const saved = btn.classList.toggle('saved');
    btn.querySelector('i').className = saved ? 'ti ti-heart-filled' : 'ti ti-heart';
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 400);

    const productName = btn.closest('.product-card')?.querySelector('h3')?.textContent ?? 'Item';
    showToast(saved ? `Saved ${productName} for your next visit` : `Removed ${productName} from your list`);
  });
});

// Newsletter form
const newsletterForm = document.getElementById('newsletterForm');
newsletterForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('You\'re on the list! 🌱');
  newsletterForm.reset();
});

// Nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(14,46,28,0.08)' : 'none';
});

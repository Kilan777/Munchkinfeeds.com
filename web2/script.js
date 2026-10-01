// Nav border once the page scrolls
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Hero loop: autoplay unless the visitor prefers reduced motion; always pausable
const heroVideo = document.getElementById('heroVideo');
const heroToggle = document.getElementById('heroToggle');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setPaused = (paused) => {
  heroToggle.classList.toggle('paused', paused);
  heroToggle.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
};

if (reduceMotion) {
  setPaused(true);
} else {
  heroVideo.play().then(() => setPaused(false)).catch(() => setPaused(true));
}

heroToggle.addEventListener('click', () => {
  if (heroVideo.paused) {
    heroVideo.play();
    setPaused(false);
  } else {
    heroVideo.pause();
    setPaused(true);
  }
});

// Forms: submit to Formspree without leaving the page
const CHECK = '<svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.5 14.5-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4z" fill="currentColor"/></svg>';

document.querySelectorAll('.js-form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const err = form.querySelector('.form-error');
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    err.hidden = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(res.status);
      form.innerHTML = `<div class="form-success" role="status">${CHECK}<p>${form.dataset.success}</p></div>`;
    } catch {
      btn.disabled = false;
      btn.textContent = label;
      err.hidden = false;
    }
  });
});

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const setMenu = (open) => {
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.hidden = !open;
  document.body.classList.toggle('menu-open', open);
};
menuBtn.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mobileMenu.hidden) setMenu(false); });
window.matchMedia('(min-width: 641px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });


function toggleServ(btn) {
  const item = btn.parentElement;
  const aberto = item.classList.contains('aberto');
  document.querySelectorAll('.serv-acc-item').forEach(i => i.classList.remove('aberto'));
  if (!aberto) item.classList.add('aberto');
}

function toggleFaq(btn) {
  const item = btn.parentElement;
  const aberto = item.classList.contains('aberto');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('aberto'));
  if (!aberto) item.classList.add('aberto');
}

/* Scroll reveal — respeita prefers-reduced-motion */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  document.querySelectorAll('.reveal-stagger').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = (i * 70) + 'ms';
    });
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));
})();

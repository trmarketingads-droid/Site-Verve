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

function toggleDisclosure(btn) {
  const item = btn.closest('.disclosure-item');
  const aberto = item.classList.contains('aberto');
  item.classList.toggle('aberto', !aberto);
  btn.textContent = aberto ? '[ Saiba mais → ]' : '[ Fechar × ]';
}

function toggleEtapa(btn) {
  const item = btn.closest('.etapa-item');
  const aberto = item.classList.contains('aberto');
  document.querySelectorAll('.etapa-item').forEach(i => i.classList.remove('aberto'));
  if (!aberto) item.classList.add('aberto');
}

function filtrarCasos(categoria, btn) {
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('ativo'));
  btn.classList.add('ativo');
  document.querySelectorAll('.caso').forEach(caso => {
    const mostrar = categoria === 'todos' || caso.dataset.categoria === categoria;
    caso.style.display = mostrar ? 'grid' : 'none';
  });
}

function enviarFormularioContato(event) {
  event.preventDefault();
  const form = event.target;
  const nome = form.nome.value.trim();
  const telefone = form.telefone.value.trim();
  const email = form.email.value.trim();
  const partes = [
    'Olá! Vim pelo site da Verve e gostaria de conversar.',
    nome ? `Nome: ${nome}` : '',
    telefone ? `Telefone: ${telefone}` : '',
    email ? `E-mail: ${email}` : ''
  ].filter(Boolean);
  const msg = encodeURIComponent(partes.join('\n'));
  window.open(`https://wa.me/5544999259338?text=${msg}`, '_blank');
}

function toggleNav() {
  const menu = document.getElementById('navMobile');
  const btn = document.querySelector('.nav-toggle');
  const aberto = menu.classList.toggle('aberto');
  btn.classList.toggle('aberto', aberto);
  document.body.style.overflow = aberto ? 'hidden' : '';
}

/* Reveal por palavra — quebra títulos .split-reveal em spans mascarados */
(function () {
  document.querySelectorAll('.split-reveal').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map(w => `<span class="split-word"><span class="split-word-inner">${w}</span></span>`)
      .join(' ');
  });
})();

/* Scroll reveal — respeita prefers-reduced-motion */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  document.querySelectorAll('.reveal-stagger').forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.transitionDelay = (i * 70) + 'ms';
    });
  });

  document.querySelectorAll('.split-reveal').forEach(group => {
    Array.from(group.querySelectorAll('.split-word-inner')).forEach((child, i) => {
      child.style.transitionDelay = (i * 45) + 'ms';
    });
  });

  const revealTargets = '.reveal, .reveal-stagger, .split-reveal';

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(revealTargets).forEach(el => el.classList.add('in-view'));
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

  document.querySelectorAll(revealTargets).forEach(el => io.observe(el));
})();

/* Parallax sutil em elementos tipográficos grandes */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.parallax');
  if (reduced || !items.length) return;

  let ticking = false;
  function update() {
    const vh = window.innerHeight;
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) * 0.08;
      el.style.transform = `translateY(${-offset}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
})();

/*
 * bindScrollProgress — reporta o progresso (0 a 1) de um wrapper alto
 * conforme ele atravessa a viewport. Usado por seções sticky que revelam
 * conteúdo em etapas (manifesto) ou deslocam algo horizontalmente
 * (projetos). Ignorado sob prefers-reduced-motion (quem chama já trata o
 * fallback estático via CSS).
 */
function bindScrollProgress(wrapper, onProgress) {
  if (!wrapper) return;
  let ticking = false;
  function update() {
    const rect = wrapper.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    let progress = total > 0 ? -rect.top / total : 0;
    progress = Math.max(0, Math.min(1, progress));
    onProgress(progress);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}

/* Manifesto — VERVE fica fixo, frases revelam conforme o scroll */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wrapper = document.getElementById('manifestoScroll');
  if (reduced || !wrapper) return;

  const fases = Array.from(wrapper.querySelectorAll('.manifesto-fase'));
  if (!fases.length) return;

  bindScrollProgress(wrapper, (progress) => {
    let idx = Math.floor(progress * fases.length);
    if (idx >= fases.length) idx = fases.length - 1;
    fases.forEach((el, i) => el.classList.toggle('ativa', i === idx));
  });
})();

/* Transição fluida entre páginas — fade-out curto antes de navegar */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    if (link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;

    e.preventDefault();
    document.body.classList.add('saindo');
    setTimeout(() => { window.location.href = href; }, 200);
  });
})();

/* Projetos — painéis deslocam horizontalmente conforme o scroll vertical (desktop) */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wrapper = document.getElementById('projetosHscroll');
  const track = document.getElementById('projetosHtrack');
  if (reduced || !wrapper || !track) return;
  if (!window.matchMedia('(min-width:901px)').matches) return;

  bindScrollProgress(wrapper, (progress) => {
    const sticky = wrapper.querySelector('.projetos-hsticky');
    const max = track.scrollWidth - sticky.clientWidth;
    if (max <= 0) return;
    track.style.transform = `translateX(${-progress * max}px)`;
  });
})();

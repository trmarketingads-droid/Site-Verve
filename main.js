/* ── MÉTODO: seletor DMD / Verve Lab / ECOA (abas, por clique/toque) ──
 * Troca o conteúdo com fade + anima a altura do painel, para não gerar
 * saltos bruscos de layout entre soluções com visuais de tamanhos diferentes. */
function selecionarMetodo(chave, btn) {
  document.querySelectorAll('.metodo-tab').forEach(t => t.classList.remove('ativo'));
  btn.classList.add('ativo');

  const painel = document.querySelector('.metodo-painel');
  const atual = painel.querySelector('.metodo-conteudo:not([hidden])');
  const novo = painel.querySelector('[data-conteudo="' + chave + '"]');
  if (!novo || atual === novo) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    atual.hidden = true; atual.classList.remove('ativo');
    novo.hidden = false; novo.classList.add('ativo');
    return;
  }

  painel.style.height = painel.offsetHeight + 'px';
  atual.style.opacity = '0';
  atual.style.transform = 'translateX(-14px)';

  setTimeout(() => {
    atual.hidden = true;
    atual.classList.remove('ativo');
    atual.style.transform = '';
    novo.hidden = false;
    novo.classList.add('ativo');
    novo.style.opacity = '0';
    novo.style.transform = 'translateX(14px)';
    const alturaNova = novo.scrollHeight;
    painel.style.height = alturaNova + 'px';
    requestAnimationFrame(() => {
      novo.style.opacity = '1';
      novo.style.transform = 'translateX(0)';
    });
    setTimeout(() => { painel.style.height = ''; }, 350);
  }, 200);
}

/* ── ECOA: diagrama circular (E-C-O-A) ── */
const ECOA_ETAPAS = {
  e: { n: '01 — ESTRUTURAR', texto: 'Organizar o que será levado ao mercado: negócio, produto ou serviço, oferta, objetivo e direcionamento comercial.' },
  c: { n: '02 — COMUNICAR', texto: 'Transformar a oferta em uma mensagem clara, com argumento, intenção de venda e direção criativa.' },
  o: { n: '03 — OPERAR', texto: 'Colocar a estratégia de mídia paga em execução, estruturando campanhas, públicos, distribuição, testes e gestão.' },
  a: { n: '04 — APRIMORAR', texto: 'Analisar o que foi feito, aprender com os dados, testar novas possibilidades, potencializar o que está funcionando e continuar evoluindo a operação.' }
};
function selecionarEtapaCircular(chave, btn) {
  const diagrama = btn.closest('.ecoa-diagrama');
  diagrama.querySelectorAll('.ecoa-no').forEach(n => n.classList.remove('ativo'));
  btn.classList.add('ativo');
  const dados = ECOA_ETAPAS[chave];
  diagrama.querySelector('[data-painel-n]').textContent = dados.n;
  diagrama.querySelector('[data-painel-texto]').textContent = dados.texto;

  const arco = diagrama.querySelector('.ecoa-arco');
  if (arco) {
    const indice = ['e', 'c', 'o', 'a'].indexOf(chave);
    const cx = 110, cy = 110, r = 86;
    const ponto = (graus) => {
      const rad = (graus - 90) * Math.PI / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };
    const sweep = indice * 90;
    if (sweep <= 0) {
      arco.setAttribute('d', '');
    } else {
      const inicio = ponto(0);
      const fim = ponto(sweep);
      const large = sweep > 180 ? 1 : 0;
      arco.setAttribute('d', `M ${inicio.x} ${inicio.y} A ${r} ${r} 0 ${large} 1 ${fim.x} ${fim.y}`);
    }
  }
}

/* ── PROJETOS: expandir resultado adicional do case ── */
function alternarCasoExtra(btn) {
  const card = btn.closest('.projeto-card');
  const aberto = card.classList.toggle('aberto');
  btn.textContent = aberto ? '− Ver menos' : '+ Ver mais';
}

/* ── PROJETOS: carrossel (setas + toque nativo via scroll-snap) ── */
function moverCarrossel(direcao) {
  const track = document.getElementById('projetosTrack');
  const card = track && track.querySelector('.projeto-card');
  if (!card) return;
  const estilo = getComputedStyle(track);
  const gap = parseFloat(estilo.columnGap || estilo.gap || '0');
  const largura = card.getBoundingClientRect().width + gap;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  track.scrollBy({ left: direcao * largura, behavior: reduced ? 'auto' : 'smooth' });
}

/* Indicadores (dots) do carrossel — acompanham o card mais visível */
(function () {
  const track = document.getElementById('projetosTrack');
  const dots = document.querySelectorAll('.projetos-dot');
  if (!track || !dots.length) return;

  let ticking = false;
  function atualizar() {
    const cards = Array.from(track.querySelectorAll('.projeto-card'));
    const centro = track.scrollLeft + track.clientWidth / 2;
    let idx = 0;
    let menorDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - centro);
      if (dist < menorDist) { menorDist = dist; idx = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('ativo', i === idx));
    ticking = false;
  }
  track.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(atualizar); ticking = true; }
  }, { passive: true });
  atualizar();
})();

/*
 * Formulário de interesse (Contato) — hoje apenas confirma o envio na
 * própria página. Integração futura (e-mail / Google Sheets / CRM) deve
 * substituir o bloco abaixo por uma chamada real, mantendo a mesma captura
 * de dados do form e o mesmo estado de sucesso.
 */
function enviarFormularioInteresse(event) {
  event.preventDefault();
  const form = event.target;
  const dados = {
    nome: form.nome.value.trim(),
    empresa: form.empresa.value.trim(),
    email: form.email.value.trim(),
    telefone: form.telefone.value.trim(),
    mensagem: form.mensagem.value.trim()
  };

  // TODO: conectar a um sistema real de captura (e-mail, Google Sheets, CRM).
  console.log('Novo contato — Quero entender se a Verve faz sentido para o meu negócio:', dados);

  form.hidden = true;
  document.getElementById('formSucesso').hidden = false;
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

/* Navegação — destaca no menu (topo e aba inferior) a seção visível na tela */
(function () {
  const secoes = ['metodo', 'projetos', 'sobre']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (!secoes.length || !('IntersectionObserver' in window)) return;

  const links = document.querySelectorAll('.nav-link, .tab-item');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.toggle('ativo', l.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  secoes.forEach(s => io.observe(s));
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

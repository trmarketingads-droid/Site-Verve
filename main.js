/* ── MÉTODO: seletor DMD / Verve Lab / ECOA (abas, por clique/toque) ── */
function selecionarMetodo(chave, btn) {
  document.querySelectorAll('.metodo-tab').forEach(t => t.classList.remove('ativo'));
  btn.classList.add('ativo');
  document.querySelectorAll('.metodo-conteudo').forEach(c => {
    const ativo = c.dataset.conteudo === chave;
    c.hidden = !ativo;
    c.classList.toggle('ativo', ativo);
  });
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

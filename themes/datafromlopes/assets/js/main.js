(function () {
  const container = document.getElementById('tag-filter');
  if (!container) return;

  const buttons = container.querySelectorAll('[data-tag]');
  const cards = document.querySelectorAll('#post-list [data-tags]');
  if (!buttons.length || !cards.length) return;

  function setActive(btn) {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  function apply(tag) {
    const t = (tag || '').toLowerCase();
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase().split(',');
      const show = (t === '__all') || tags.indexOf(t) !== -1;
      card.style.display = show ? '' : 'none';
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setActive(btn);
      apply(btn.getAttribute('data-tag'));
    });
  });
})();

/* ==============================================
 * 2) Header (#sideNav) só no MOBILE (<= 992px)
 *    - Esconde quando scrollY > TOP_REVEAL
 *    - Mostra quando scrollY <= TOP_REVEAL
 *    - Mantém visível se o collapse estiver aberto
 * ============================================== */
(function () {
  const nav = document.getElementById('sideNav');
  if (!nav) return;

  const collapse = document.getElementById('navbarResponsive');
  const toggler  = document.querySelector('[data-bs-target="#navbarResponsive"]');

  const mq = window.matchMedia('(max-width: 991.98px)');
  const isMobile = () => mq.matches;

  const TOP_REVEAL = 48; // px antes do topo para reexibir o menu (ajuste se quiser)

  // expõe a altura do header (caso use --head-h no CSS)
  function setHeadH() {
    if (isMobile()) {
      document.documentElement.style.setProperty('--head-h', nav.offsetHeight + 'px');
    }
  }

  function updateVisibility() {
    // Desktop: sem ação
    if (!isMobile()) {
      nav.classList.remove('is-hidden', 'menu-open');
      return;
    }
    const nearTop = window.scrollY <= TOP_REVEAL;
    const open    = collapse && collapse.classList.contains('show');
    const show    = nearTop || open;

    nav.classList.toggle('is-hidden', !show);
    nav.classList.toggle('menu-open', !!open);
  }

  // aplicar rápido nos eventos
  window.addEventListener('load', () => { setHeadH(); updateVisibility(); }, { passive: true });
  window.addEventListener('resize', () => { setHeadH(); updateVisibility(); }, { passive: true });
  window.addEventListener('scroll', () => { if (isMobile()) updateVisibility(); }, { passive: true });

  // reagir a mudanças de breakpoint
  if (mq.addEventListener) mq.addEventListener('change', () => { setHeadH(); updateVisibility(); });
  else if (mq.addListener) mq.addListener(() => { setHeadH(); updateVisibility(); });

  // integrar com Bootstrap (se disponível)
  if (collapse) {
    collapse.addEventListener('shown.bs.collapse', updateVisibility);
    collapse.addEventListener('hidden.bs.collapse', updateVisibility);
  }
  if (toggler && collapse) {
    toggler.addEventListener('click', () => {
      // chama no próximo frame para refletir a mudança de classe 'show'
      requestAnimationFrame(updateVisibility);
    });
  }

  // inicial
  setHeadH();
  updateVisibility();
})();
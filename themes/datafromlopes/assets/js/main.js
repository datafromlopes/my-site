/* =========================
 * 1) Header mobile
 * ========================= */
(function () {
  const nav = document.getElementById('sideNav');
  if (!nav) return;

  const collapse = document.getElementById('navbarResponsive');
  const toggler = document.querySelector('[data-bs-target="#navbarResponsive"]');

  const mq = window.matchMedia('(max-width: 991.98px)');
  const isMobile = () => mq.matches;
  const TOP_REVEAL = 48;

  function setHeadH() {
    if (isMobile()) document.documentElement.style.setProperty('--head-h', nav.offsetHeight + 'px');
    else document.documentElement.style.removeProperty('--head-h');
  }

  function updateVisibility() {
    if (!isMobile()) { nav.classList.remove('is-hidden', 'menu-open'); return; }
    const nearTop = window.scrollY <= TOP_REVEAL;
    const open = collapse && collapse.classList.contains('show');
    const show = nearTop || open;
    nav.classList.toggle('is-hidden', !show);
    nav.classList.toggle('menu-open', !!open);
  }

  window.addEventListener('load', () => { setHeadH(); updateVisibility(); }, { passive: true });
  window.addEventListener('resize', () => { setHeadH(); updateVisibility(); }, { passive: true });
  window.addEventListener('scroll', () => { if (isMobile()) updateVisibility(); }, { passive: true });

  if (mq.addEventListener) mq.addEventListener('change', () => { setHeadH(); updateVisibility(); });
  else if (mq.addListener) mq.addListener(() => { setHeadH(); updateVisibility(); });

  if (collapse) {
    collapse.addEventListener('shown.bs.collapse', () => { setHeadH(); updateVisibility(); });
    collapse.addEventListener('hidden.bs.collapse', () => { setHeadH(); updateVisibility(); });
  }
  if (toggler && collapse) {
    toggler.addEventListener('click', () => {
      requestAnimationFrame(() => { setHeadH(); updateVisibility(); });
    }, { passive: true });
  }

  setHeadH(); updateVisibility();
})();

/* =========================
 * 2) Fechar o collapse ao clicar em um link do menu
 * ========================= */
(function () {
  const collapseEl = document.getElementById('navbarResponsive');
  if (!collapseEl) return;

  function closeCollapse() {
    if (!collapseEl.classList.contains('show')) return;
    try {
      if (window.bootstrap?.Collapse) {
        window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
      } else {
        collapseEl.classList.remove('show');
      }
    } catch (_) {
      collapseEl.classList.remove('show');
    }
  }

  collapseEl.querySelectorAll('a.nav-link, a.dropdown-item').forEach(a => {
    a.addEventListener('click', () => {
      closeCollapse();
    }, { passive: true });
  });
})();

/* =========================
 * Calcular anos de experiência
 * ========================= */
(function () {
  const startDate = new Date('2018-08-01');
  const today = new Date();

  // Calcular diferença total em meses
  const totalMonths = (today.getFullYear() - startDate.getFullYear()) * 12
    + (today.getMonth() - startDate.getMonth());

  // Calcular anos e meses restantes
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  // Apenas anos (para bio)
  const yearsOnly = years;

  // Anos e meses (para timeline)
  let yearsMonthsText = '';
  if (years > 0 && months > 0) {
    yearsMonthsText = `${years}y ${months}m`;
  } else if (years > 0) {
    yearsMonthsText = `${years}y`;
  } else {
    yearsMonthsText = `${months}m`;
  }

  // Atualizar elementos que mostram apenas anos
  const yearsElements = document.querySelectorAll('.years-experience');
  yearsElements.forEach(function (element) {
    element.textContent = yearsOnly;
  });

  // Atualizar elementos que mostram anos e meses
  const yearsMonthsElements = document.querySelectorAll('.years-months-experience');
  yearsMonthsElements.forEach(function (element) {
    element.textContent = yearsMonthsText;
  });
})();

/* =========================
 * 4) Filtro COM PAGINAÇÃO (Projects e Blog)
 * ========================= */
(function () {
  // Detecta se é página de projetos ou blog
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const blogCards = Array.from(document.querySelectorAll('.blog-card'));

  const cards = projectCards.length ? projectCards : blogCards;
  if (!cards.length) return;

  const itemType = projectCards.length ? 'projects' : 'posts';
  const itemsPerPage = 6;
  let currentPage = 1;
  let currentTag = '__all';
  let filteredItems = [];

  const tagButtons = document.querySelectorAll('.tag-filter-btn');
  const pagination = document.querySelector('#pagination .pagination');
  const resultsInfo = document.getElementById('showing-count');

  // Função para filtrar items
  function filterItems(tag) {
    const t = (tag || '').toLowerCase().trim();

    if (t === '__all') {
      filteredItems = cards;
    } else {
      filteredItems = cards.filter(card => {
        const tags = (card.getAttribute('data-tags') || '')
          .toLowerCase()
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        return tags.includes(t);
      });
    }

    currentPage = 1;
    renderPage();
  }

  // Função para renderizar a página atual
  function renderPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    // Esconde todos os cards
    cards.forEach(card => card.style.display = 'none');

    // Mostra apenas os da página atual
    filteredItems.slice(start, end).forEach(card => {
      card.style.display = 'block';
    });

    // Atualiza info de resultados
    if (resultsInfo) {
      const showing = Math.min(end, filteredItems.length);
      if (filteredItems.length === 0) {
        resultsInfo.textContent = `No ${itemType} found`;
      } else {
        resultsInfo.textContent = `Showing ${start + 1}-${showing} of ${filteredItems.length} ${itemType}`;
      }
    }

    // Renderiza paginação
    renderPagination(totalPages);
  }

  // Função para renderizar os botões de paginação
  function renderPagination(totalPages) {
    if (!pagination) return;

    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let html = '';

    // Botão Anterior
    if (currentPage > 1) {
      html += `<li class="page-item">
        <a class="page-link" href="#" data-page="${currentPage - 1}">
          <i class="bi bi-chevron-left"></i>
        </a>
      </li>`;
    } else {
      html += `<li class="page-item disabled">
        <span class="page-link"><i class="bi bi-chevron-left"></i></span>
      </li>`;
    }

    // Números das páginas
    const window = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - window && i <= currentPage + window)) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
      } else if (i === currentPage - window - 1 || i === currentPage + window + 1) {
        html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
      }
    }

    // Botão Próximo
    if (currentPage < totalPages) {
      html += `<li class="page-item">
        <a class="page-link" href="#" data-page="${currentPage + 1}">
          <i class="bi bi-chevron-right"></i>
        </a>
      </li>`;
    } else {
      html += `<li class="page-item disabled">
        <span class="page-link"><i class="bi bi-chevron-right"></i></span>
      </li>`;
    }

    pagination.innerHTML = html;

    // Adiciona event listeners nos botões de página
    pagination.querySelectorAll('a[data-page]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = parseInt(btn.dataset.page);
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // Event listeners para os botões de tag
  if (tagButtons.length) {
    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active de todos
        tagButtons.forEach(b => b.classList.remove('active'));
        // Adiciona active no clicado
        btn.classList.add('active');

        currentTag = btn.getAttribute('data-tag');
        filterItems(currentTag);
      });
    });
  }

  // Inicializa mostrando todos os items
  filterItems('__all');
})();


/* =========================
 * 5) MailerLite Universal Form
 * ========================= */
(function (w, d, e, u, f, l, n) {
  w[f] = w[f] || function () {
    (w[f].q = w[f].q || [])
    .push(arguments);
  }, l = d.createElement(e), l.async = 1, l.src = u,
  n = d.getElementsByTagName(e)[0], n.parentNode.insertBefore(l, n);
})
  (window, document, 'script', 'https://assets.mailerlite.com/js/universal.js', 'ml');
ml('account', '2139800');
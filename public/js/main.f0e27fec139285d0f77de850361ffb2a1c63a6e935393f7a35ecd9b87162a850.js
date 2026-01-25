(() => {
  // <stdin>
  (function() {
    const nav = document.getElementById("sideNav");
    if (!nav) return;
    const collapse = document.getElementById("navbarResponsive");
    const toggler = document.querySelector('[data-bs-target="#navbarResponsive"]');
    const mq = window.matchMedia("(max-width: 991.98px)");
    const isMobile = () => mq.matches;
    const TOP_REVEAL = 48;
    function setHeadH() {
      if (isMobile()) document.documentElement.style.setProperty("--head-h", nav.offsetHeight + "px");
      else document.documentElement.style.removeProperty("--head-h");
    }
    function updateVisibility() {
      if (!isMobile()) {
        nav.classList.remove("is-hidden", "menu-open");
        return;
      }
      const nearTop = window.scrollY <= TOP_REVEAL;
      const open = collapse && collapse.classList.contains("show");
      const show = nearTop || open;
      nav.classList.toggle("is-hidden", !show);
      nav.classList.toggle("menu-open", !!open);
    }
    window.addEventListener("load", () => {
      setHeadH();
      updateVisibility();
    }, { passive: true });
    window.addEventListener("resize", () => {
      setHeadH();
      updateVisibility();
    }, { passive: true });
    window.addEventListener("scroll", () => {
      if (isMobile()) updateVisibility();
    }, { passive: true });
    if (mq.addEventListener) mq.addEventListener("change", () => {
      setHeadH();
      updateVisibility();
    });
    else if (mq.addListener) mq.addListener(() => {
      setHeadH();
      updateVisibility();
    });
    if (collapse) {
      collapse.addEventListener("shown.bs.collapse", () => {
        setHeadH();
        updateVisibility();
      });
      collapse.addEventListener("hidden.bs.collapse", () => {
        setHeadH();
        updateVisibility();
      });
    }
    if (toggler && collapse) {
      toggler.addEventListener("click", () => {
        requestAnimationFrame(() => {
          setHeadH();
          updateVisibility();
        });
      }, { passive: true });
    }
    setHeadH();
    updateVisibility();
  })();
  (function() {
    const collapseEl = document.getElementById("navbarResponsive");
    if (!collapseEl) return;
    function closeCollapse() {
      if (!collapseEl.classList.contains("show")) return;
      try {
        if (window.bootstrap?.Collapse) {
          window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
        } else {
          collapseEl.classList.remove("show");
        }
      } catch (_) {
        collapseEl.classList.remove("show");
      }
    }
    collapseEl.querySelectorAll("a.nav-link, a.dropdown-item").forEach((a) => {
      a.addEventListener("click", () => {
        closeCollapse();
      }, { passive: true });
    });
  })();
  (function() {
    const startDate = /* @__PURE__ */ new Date("2018-08-01");
    const today = /* @__PURE__ */ new Date();
    const years = Math.floor((today - startDate) / (365.25 * 24 * 60 * 60 * 1e3));
    const elements = document.querySelectorAll(".years-experience");
    elements.forEach(function(element) {
      element.textContent = years;
    });
  })();
  (function() {
    const projectCards = Array.from(document.querySelectorAll(".project-card"));
    const blogCards = Array.from(document.querySelectorAll(".blog-card"));
    const cards = projectCards.length ? projectCards : blogCards;
    if (!cards.length) return;
    const itemType = projectCards.length ? "projects" : "posts";
    const itemsPerPage = 6;
    let currentPage = 1;
    let currentTag = "__all";
    let filteredItems = [];
    const tagButtons = document.querySelectorAll(".tag-filter-btn");
    const pagination = document.querySelector("#pagination .pagination");
    const resultsInfo = document.getElementById("showing-count");
    function filterItems(tag) {
      const t = (tag || "").toLowerCase().trim();
      if (t === "__all") {
        filteredItems = cards;
      } else {
        filteredItems = cards.filter((card) => {
          const tags = (card.getAttribute("data-tags") || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
          return tags.includes(t);
        });
      }
      currentPage = 1;
      renderPage();
    }
    function renderPage() {
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
      cards.forEach((card) => card.style.display = "none");
      filteredItems.slice(start, end).forEach((card) => {
        card.style.display = "block";
      });
      if (resultsInfo) {
        const showing = Math.min(end, filteredItems.length);
        if (filteredItems.length === 0) {
          resultsInfo.textContent = `No ${itemType} found`;
        } else {
          resultsInfo.textContent = `Showing ${start + 1}-${showing} of ${filteredItems.length} ${itemType}`;
        }
      }
      renderPagination(totalPages);
    }
    function renderPagination(totalPages) {
      if (!pagination) return;
      if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
      }
      let html = "";
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
      const window2 = 2;
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || i >= currentPage - window2 && i <= currentPage + window2) {
          html += `<li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>`;
        } else if (i === currentPage - window2 - 1 || i === currentPage + window2 + 1) {
          html += `<li class="page-item disabled"><span class="page-link">\u2026</span></li>`;
        }
      }
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
      pagination.querySelectorAll("a[data-page]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          currentPage = parseInt(btn.dataset.page);
          renderPage();
          window2.scrollTo({ top: 0, behavior: "smooth" });
        });
      });
    }
    if (tagButtons.length) {
      tagButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          tagButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          currentTag = btn.getAttribute("data-tag");
          filterItems(currentTag);
        });
      });
    }
    filterItems("__all");
  })();
})();

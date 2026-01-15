(() => {
  // <stdin>
  (function() {
    const container = document.getElementById("tag-filter");
    if (!container) return;
    const buttons = container.querySelectorAll("[data-tag]");
    const cards = document.querySelectorAll("#post-list [data-tags]");
    if (!buttons.length || !cards.length) return;
    function setActive(btn) {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }
    function apply(tag) {
      const t = (tag || "").toLowerCase().trim();
      cards.forEach((card) => {
        const tags = (card.getAttribute("data-tags") || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
        const show = t === "__all" || tags.includes(t);
        card.style.display = show ? "" : "none";
      });
    }
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setActive(btn);
        apply(btn.getAttribute("data-tag"));
      }, { passive: true });
    });
  })();
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
    const startDate = /* @__PURE__ */ new Date("2018-08-01");
    const today = /* @__PURE__ */ new Date();
    const years = Math.floor((today - startDate) / (365.25 * 24 * 60 * 60 * 1e3));
    document.getElementById("years-experience").textContent = years;
    document.addEventListener("DOMContentLoaded", function() {
      const ITEMS_PER_PAGE = 4;
      const allProjects = Array.from(document.querySelectorAll(".project-item"));
      const paginationContainer = document.getElementById("js-pagination");
      const filterButtons = document.querySelectorAll(".tag-filter-btn");
      let currentFilter = "__all";
      let currentPage = 1;
      function render() {
        const visibleProjects = allProjects.filter((project) => {
          const tags = project.getAttribute("data-tags").split(",");
          return currentFilter === "__all" || tags.includes(currentFilter);
        });
        const totalPages = Math.ceil(visibleProjects.length / ITEMS_PER_PAGE);
        if (currentPage > totalPages) currentPage = 1;
        if (totalPages === 0) currentPage = 1;
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        allProjects.forEach((p) => p.style.display = "none");
        visibleProjects.forEach((project, index) => {
          if (index >= startIndex && index < endIndex) {
            project.style.display = "block";
            project.style.animation = "fadeIn 0.5s";
          }
        });
        renderPagination(totalPages);
      }
      function renderPagination(totalPages) {
        paginationContainer.innerHTML = "";
        if (totalPages <= 1) return;
        const ul = document.createElement("ul");
        ul.className = "pagination";
        const prevLi = document.createElement("li");
        prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
        prevLi.innerHTML = `<a class="page-link" href="#" onclick="return false;"><i class="bi bi-chevron-left"></i></a>`;
        prevLi.addEventListener("click", (e) => {
          e.preventDefault();
          if (currentPage > 1) {
            currentPage--;
            render();
            window.scrollTo(0, document.getElementById("post-list").offsetTop - 100);
          }
        });
        ul.appendChild(prevLi);
        for (let i = 1; i <= totalPages; i++) {
          const li = document.createElement("li");
          li.className = `page-item ${i === currentPage ? "active" : ""}`;
          li.innerHTML = `<a class="page-link" href="#" onclick="return false;">${i}</a>`;
          li.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            render();
            window.scrollTo(0, document.getElementById("post-list").offsetTop - 100);
          });
          ul.appendChild(li);
        }
        const nextLi = document.createElement("li");
        nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
        nextLi.innerHTML = `<a class="page-link" href="#" onclick="return false;"><i class="bi bi-chevron-right"></i></a>`;
        nextLi.addEventListener("click", (e) => {
          e.preventDefault();
          if (currentPage < totalPages) {
            currentPage++;
            render();
            window.scrollTo(0, document.getElementById("post-list").offsetTop - 100);
          }
        });
        ul.appendChild(nextLi);
        paginationContainer.appendChild(ul);
      }
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", function() {
          filterButtons.forEach((b) => b.classList.remove("active"));
          this.classList.add("active");
          currentFilter = this.getAttribute("data-tag");
          currentPage = 1;
          render();
        });
      });
      render();
    });
  })();
})();

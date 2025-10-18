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
      const t = (tag || "").toLowerCase();
      cards.forEach((card) => {
        const tags = (card.getAttribute("data-tags") || "").toLowerCase().split(",");
        const show = t === "__all" || tags.indexOf(t) !== -1;
        card.style.display = show ? "" : "none";
      });
    }
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        setActive(btn);
        apply(btn.getAttribute("data-tag"));
      });
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
      if (isMobile()) {
        document.documentElement.style.setProperty("--head-h", nav.offsetHeight + "px");
      } else {
        document.documentElement.style.removeProperty("--head-h");
      }
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
      });
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
          const bs = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
          bs.hide();
        } else {
          collapseEl.classList.remove("show");
        }
      } catch (_) {
        collapseEl.classList.remove("show");
      }
    }
    function isHash(href) {
      return href && href.trim().startsWith("#");
    }
    document.addEventListener("click", function(ev) {
      const a = ev.target.closest("#navbarResponsive a.nav-link, #navbarResponsive a.dropdown-item, #sideNav > a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!isHash(href)) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        window.location.assign(a.href);
        closeCollapse();
      } else {
        closeCollapse();
      }
    }, true);
  })();
})();

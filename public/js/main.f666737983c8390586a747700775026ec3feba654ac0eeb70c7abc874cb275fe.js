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
        const raw = card.getAttribute("data-tags") || "";
        const tags = raw.toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
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
    const collapseEl = document.getElementById("navbarResponsive");
    if (!collapseEl) return;
    function closeOnClick(selector) {
      collapseEl.querySelectorAll(selector).forEach((a) => {
        a.addEventListener("click", () => {
          const isOpen = collapseEl.classList.contains("show");
          if (!isOpen) return;
          try {
            if (window.bootstrap && window.bootstrap.Collapse) {
              const bs = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
              bs.hide();
            } else {
              collapseEl.classList.remove("show");
            }
          } catch (_) {
            collapseEl.classList.remove("show");
          }
        }, { passive: true });
      });
    }
    closeOnClick("a.nav-link, a.dropdown-item, a.navbar-brand");
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
      }, { passive: true });
    }
    setHeadH();
    updateVisibility();
  })();
  (function() {
    document.querySelectorAll('[data-nohit="true"]').forEach((el) => {
      el.style.pointerEvents = "none";
    });
  })();
})();

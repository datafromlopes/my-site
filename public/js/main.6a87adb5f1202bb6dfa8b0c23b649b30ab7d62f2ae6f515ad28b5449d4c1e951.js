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
    const collapseEl = document.getElementById("navbarResponsive");
    const brandLink = document.querySelector("#sideNav > a[href]");
    if (!collapseEl) return;
    collapseEl.querySelectorAll(".js-scroll-trigger").forEach((el) => el.classList.remove("js-scroll-trigger"));
    if (brandLink) brandLink.classList.remove("js-scroll-trigger");
    function isHash(href) {
      return href && href.trim().startsWith("#");
    }
    function closeCollapse() {
      if (!collapseEl.classList.contains("show")) return;
      try {
        if (window.bootstrap && window.bootstrap.Collapse) {
          window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
        } else {
          collapseEl.classList.remove("show");
        }
      } catch (_) {
        collapseEl.classList.remove("show");
      }
    }
    function handleAnchorClick(a) {
      const href = a.getAttribute("href") || "";
      if (isHash(href)) {
        closeCollapse();
        return;
      }
      a.addEventListener("click", function onClick(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        closeCollapse();
        window.location.href = a.href;
      }, { once: true });
    }
    collapseEl.querySelectorAll("a.nav-link, a.dropdown-item").forEach((a) => {
      a.removeAttribute("data-bs-toggle");
      handleAnchorClick(a);
    });
    if (brandLink) {
      brandLink.addEventListener("click", () => {
        closeCollapse();
      }, { passive: true });
    }
  })();
})();

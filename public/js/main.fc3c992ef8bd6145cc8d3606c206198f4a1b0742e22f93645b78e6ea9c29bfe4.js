(() => {
  // <stdin>
  (function() {
    const collapseEl = document.getElementById("navbarResponsive");
    if (!collapseEl) return;
    function closeIfOpen() {
      const isOpen = collapseEl.classList.contains("show");
      if (!isOpen) return;
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
    collapseEl.querySelectorAll("a.nav-link, a.dropdown-item, a.navbar-brand").forEach((a) => {
      a.addEventListener("click", closeIfOpen, { passive: true });
    });
  })();
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
})();

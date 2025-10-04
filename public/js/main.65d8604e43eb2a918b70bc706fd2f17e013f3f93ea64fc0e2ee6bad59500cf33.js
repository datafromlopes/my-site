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
    const content = document.getElementById("content");
    function setHeadH() {
      document.documentElement.style.setProperty("--head-h", nav.offsetHeight + "px");
    }
    setHeadH();
    window.addEventListener("load", setHeadH);
    window.addEventListener("resize", setHeadH);
    let lastY = window.scrollY;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > lastY && y > 20;
        const menuOpen = collapse && collapse.classList.contains("show");
        if (!menuOpen) {
          nav.classList.toggle("is-hidden", goingDown);
          const onDesktop = window.matchMedia("(min-width: 992px)").matches;
          if (onDesktop && content) {
            content.classList.toggle("without-sidebar", goingDown);
          }
        }
        lastY = y;
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    if (collapse) {
      collapse.addEventListener("shown.bs.collapse", () => {
        nav.classList.remove("is-hidden");
        nav.classList.add("menu-open");
      });
      collapse.addEventListener("hidden.bs.collapse", () => {
        nav.classList.remove("menu-open");
      });
    }
    if (toggler && collapse) {
      toggler.addEventListener("click", () => {
        setTimeout(() => {
          const open = collapse.classList.contains("show");
          nav.classList.toggle("menu-open", open);
          if (open) nav.classList.remove("is-hidden");
        }, 0);
      });
    }
  })();
})();

(() => {
  // <stdin>
  (function() {
    var container = document.getElementById("tag-filter");
    if (!container) return;
    var buttons = container.querySelectorAll("[data-tag]");
    var cards = document.querySelectorAll("#post-list [data-tags]");
    function setActive(btn) {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }
    function apply(tag) {
      cards.forEach((card) => {
        var tags = (card.getAttribute("data-tags") || "").toLowerCase().split(",");
        var show = tag === "__all" || tags.indexOf(tag.toLowerCase()) !== -1;
        card.style.display = show ? "" : "none";
      });
    }
    buttons.forEach((btn) => {
      btn.addEventListener("click", function() {
        setActive(btn);
        apply(btn.getAttribute("data-tag"));
      });
    });
  })();
})();

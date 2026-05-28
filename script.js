document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const parallaxTargets = Array.from(document.querySelectorAll(".background"));
  const revealTargets = [
    ...document.querySelectorAll("section"),
    ...document.querySelectorAll(".section4 .row"),
    ...document.querySelectorAll(".footer ul, .footer__links, .footer__more, .footer__copyright"),
  ];

  body.classList.add("js-enhanced");

  requestAnimationFrame(() => {
    body.classList.add("is-ready");
  });

  revealTargets.forEach((element) => {
    element.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));

  const updateScrollState = () => {
    const scrollY = window.scrollY;
    body.classList.toggle("scrolled", scrollY > 16);

    parallaxTargets.forEach((background, index) => {
      const section = background.closest("section, .section4__item");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distance = rect.top + rect.height / 2 - viewportCenter;
      const speed = section.classList.contains("section4__item") ? 0.02 : 0.035;
      const drift = Math.max(-28, Math.min(28, -distance * speed));

      background.style.setProperty("--parallax-y", `${drift}px`);
      background.style.setProperty("--parallax-scale", index < 2 ? "1.08" : "1.04");
    });
  };

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState);

  document
    .querySelectorAll(".section1, .section2, .section3, .section4__item")
    .forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;

        card.style.setProperty("--pointer-x", `${x}px`);
        card.style.setProperty("--pointer-y", `${y}px`);
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--pointer-x", "0px");
        card.style.setProperty("--pointer-y", "0px");
      });
    });
});

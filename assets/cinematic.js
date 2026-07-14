"use strict";

const showcaseProjects = {
  grading: [
    { title: "Coffee", id: "1209467321" },
    { title: "Color", id: "1209467333" },
    { title: "Vlog By THN", id: "1209467828" }
  ],
  brand: [
    { title: "Burmese Ghoul", id: "1209467303" },
    { title: "Kabyar Event", id: "1209472014" },
    { title: "TR MD", id: "1209467520" }
  ],
  longform: [
    { title: "LTN 1", id: "1209397118" },
    { title: "LTN 2", id: "1209397402" },
    { title: "MDY", id: "1209397155" },
    { title: "Bro Code", id: "1209397102" }
  ],
  street: [
    { title: "Mhann 1", id: "1209397764" },
    { title: "Mhann 2", id: "1209397786" },
    { title: "Mhann 3", id: "1209397819" }
  ],
  reels: [
    { title: "OmeTV Prank 1", id: "1209397863" },
    { title: "OmeTV Prank 2", id: "1209397877" },
    { title: "OmeTV Prank 3", id: "1209397904" }
  ]
};

const categoryLabels = {
  grading: "Color Grading & Cinematography",
  brand: "Event & Brand Productions",
  longform: "YouTube / 16:9 Long-Form Content",
  street: "Street Interview & Entertainment",
  reels: "Reel / TikTok / OmeTV Prank"
};

const showcaseGrid = document.querySelector("#showcase-grid");
const showcaseTabs = [...document.querySelectorAll(".showcase-tab")];

function videoEmbed(project) {
  return `https://player.vimeo.com/video/${project.id}?title=0&byline=0&portrait=0&controls=1&playsinline=1&dnt=1`;
}

function renderShowcase(category) {
  if (!showcaseGrid || !showcaseProjects[category]) return;

  showcaseGrid.innerHTML = showcaseProjects[category].map((project, index) => `
    <article class="video-tile video-tile--inline" style="animation-delay:${index * 70}ms">
      <div class="video-tile__media video-tile__media--player">
        <iframe
          src="${videoEmbed(project)}"
          title="${project.title} portfolio video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowfullscreen
          loading="${index === 0 ? 'eager' : 'lazy'}">
        </iframe>
      </div>
      <div class="video-tile__copy video-tile__copy--inline">
        <span class="video-tile__index video-tile__index--inline">${String(index + 1).padStart(2, "0")} / ${String(showcaseProjects[category].length).padStart(2, "0")}</span>
        <h3>${project.title}</h3>
        <p>${categoryLabels[category]}</p>
      </div>
    </article>
  `).join("");
}

showcaseTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showcaseTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    renderShowcase(tab.dataset.category);
  });
});

function formatMetric(value, element) {
  if (element.dataset.format !== "compact") return Math.round(value).toLocaleString("en-US") + "+";
  const decimal = Number(element.dataset.decimal || 0);
  const divisor = value >= 1000000 ? 1000000 : 1000;
  const suffix = value >= 1000000 ? "M" : "K";
  return `${(value / divisor).toFixed(decimal)}${suffix}+`;
}

function animateCount(element) {
  const target = Number(element.dataset.count);
  const start = performance.now();
  const duration = 1500;
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatMetric(target * eased, element);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries, activeObserver) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    entry.target.querySelectorAll("[data-count]").forEach(animateCount);
    activeObserver.unobserve(entry.target);
  });
}, { threshold: 0.18 }) : null;

const revealElements = document.querySelectorAll(".reveal-heading, .reveal-card");
if (observer) {
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
    element.querySelectorAll("[data-count]").forEach((counter) => {
      counter.textContent = formatMetric(Number(counter.dataset.count), counter);
    });
  });
}

renderShowcase("grading");


function setupCasePreviews() {
  const previews = [...document.querySelectorAll(".case-preview-video")];

  previews.forEach((video) => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
  });

  if (!("IntersectionObserver" in window)) {
    previews.forEach((video) => video.play().catch(() => {}));
    return;
  }

  const previewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });

  previews.forEach((video) => previewObserver.observe(video));
}

setupCasePreviews();

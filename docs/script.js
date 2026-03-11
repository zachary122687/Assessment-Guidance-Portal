// ========================================
// Portal Script - Debug-Friendly Version
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFooterYear();
  initSearch();
  loadAssessmentSchedule();
  initTabs();
  loadGuidance();
});

// ========================================
// Theme Toggle
// ========================================
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  let theme = localStorage.getItem("theme") || "light";
  root.dataset.theme = theme;

  if (!toggle) return;

  toggle.textContent = theme === "dark" ? "🌙" : "☀️";

  toggle.addEventListener("click", () => {
    theme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = theme;
    toggle.textContent = theme === "dark" ? "🌙" : "☀️";
    localStorage.setItem("theme", theme);
  });
}

// ========================================
// Footer Year
// ========================================
function initFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ========================================
// Search
// ========================================
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  let timeout;
  input.addEventListener("input", (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const query = (e.target.value || "").toLowerCase();
      document.querySelectorAll(".card").forEach((card) => {
        const visible = card.innerText.toLowerCase().includes(query);
        card.style.display = visible ? "" : "none";
      });
    }, 200);
  });
}

// ========================================
// Load Markdown from GitHub
// ========================================
async function loadMarkdown(url, container) {
  if (!container) return;
  if (container.dataset.loaded === "true") return;

  container.innerHTML = "Loading...";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const markdown = await response.text();
    container.innerHTML = marked.parse(markdown);
    container.dataset.loaded = "true";
  } catch (err) {
    console.error("Markdown load failed:", err);
    container.innerHTML = "<p style='color:red'>Failed to load document.</p>";
  }
}

// ========================================
// Assessment Schedule
// ========================================
function loadAssessmentSchedule() {
  const container = document.getElementById("scheduleContent");
  if (!container) return;

  const url =
    "https://www.oregon.gov/eis/cyber-security-services/Documents/eis-css-assessment-schedule.pdf";

  container.innerHTML = `
    <p>
      <a href="${url}" target="_blank" rel="noopener">
        Open Cybersecurity Assessment Schedule (PDF)
      </a>
    </p>
  `;
}

// ========================================
// Tabs
// ========================================
const markdownFiles = {
  request: "Artifact-Request.md",
  collector: "Artifact-Collector-Powershell-Scripts.md",
  index: "CSS-Assessment-Index.md",
  relationships: "CSS-Assessment-Safeguard-Interrelationships.md",
  kql: "Defender-KQL.md",
  grouppolicy: "Group-Policy-Settings.md",
  recommend: "Implementation-Recommendations.md",
};
const repoBase =
  "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/";

function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      const tabName = tab.dataset.tab;
      activateTab(tab);
      activatePanel(tabName);

      if (!markdownFiles[tabName]) return;

      const panel = document.getElementById(`panel-${tabName}`);
      if (!panel) return;

      const container = panel.querySelector("div");
      const url = repoBase + markdownFiles[tabName];

      console.log("Loading markdown:", url);
      await loadMarkdown(url, container);
    });
  });
}

function activateTab(activeTab) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab === activeTab);
  });
}

function activatePanel(name) {
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle(panel.id === `panel-${name}`, true);
  });
}

// ========================================
// Load Guidance JSON
// ========================================
async function loadGuidance() {
  try {
    console.log("Fetching guidance.json...");
    const res = await fetch("guidance.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log("Loaded guidance.json:", data);

    // --- Templates ---
    const templateList = document.getElementById("templateList");
    if (templateList && data.templates) {
      templateList.innerHTML = data.templates
        .map(
          (t) => `
        <li>
          <a href="${t.href}" target="_blank">${t.name}</a> — ${t.desc}
        </li>`
        )
        .join("");
    }

    // --- FAQ ---
    const faqList = document.getElementById("faqList");
    if (faqList && data.faq) {
      faqList.innerHTML = data.faq
        .map(
          (q) => `
        <details>
          <summary>${q.q}</summary>
          <p>${q.a}</p>
        </details>`
        )
        .join("");
    }

    // --- Resources ---
    const docs = document.getElementById("resourceDocs");
    const links = document.getElementById("resourceLinks");
    if (docs && data.resources?.docs) {
      docs.innerHTML = data.resources.docs
        .map((r) => `<li><a href="${r.href}" target="_blank">${r.name}</a></li>`)
        .join("");
    }
    if (links && data.resources?.links) {
      links.innerHTML = data.resources.links
        .map((r) => `<li><a href="${r.href}" target="_blank">${r.name}</a></li>`)
        .join("");
    }

    // --- Announcements ---
    const ann = document.getElementById("announcementsList");
    if (ann && data.announcements) {
      ann.innerHTML = data.announcements
        .map((a) => `<li><strong>${a.date}</strong> — ${a.text}</li>`)
        .join("");
    }

    // --- Roadmap ---
    const roadmap = document.getElementById("roadmapList");
    if (roadmap && data.roadmap) {
      roadmap.innerHTML = data.roadmap
        .map((r) => `<li><strong>${r.quarter}</strong>: ${r.items.join(", ")}</li>`)
        .join("");
    }
  } catch (err) {
    console.error("Failed to load guidance.json:", err);
    alert(
      "Failed to load guidance.json. Make sure it exists and you are running the site via HTTP (not file://). Check console for details."
    );
  }
}

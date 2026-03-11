// ==========================
// Theme Toggle
// ==========================
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

let currentTheme = localStorage.getItem("theme") || "light";
root.dataset.theme = currentTheme;

if (toggle) {
  toggle.textContent = currentTheme === "dark" ? "🌙" : "☀️";

  toggle.addEventListener("click", () => {
    const newTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = newTheme;
    toggle.textContent = newTheme === "dark" ? "🌙" : "☀️";
    localStorage.setItem("theme", newTheme);
  });
}

// ==========================
// Footer Year
// ==========================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ==========================
// Search
// ==========================
const searchInput = document.getElementById("searchInput");
let searchTimeout;

searchInput?.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    const q = (e.target.value || "").toLowerCase();

    document.querySelectorAll(".card").forEach((card) => {
      card.style.display =
        card.innerText.toLowerCase().includes(q) ? "" : "none";
    });
  }, 200);
});

// ==========================
// Markdown Loader
// ==========================
async function loadMarkdown(url, containerId, fallbackMessage) {
  const container = document.getElementById(containerId);

  if (!container || container.dataset.loaded === "true") return;

  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const markdown = await res.text();

    container.innerHTML = marked.parse(markdown);
    container.dataset.loaded = "true";

  } catch (err) {
    container.innerHTML = `<p style="color:red;">${fallbackMessage}</p>`;
    console.error(`Failed to load Markdown from ${url}:`, err);
  }
}

// ==========================
// Assessment Schedule
// ==========================
function loadAssessmentSchedule() {

  const scheduleUrl =
    "https://www.oregon.gov/eis/cyber-security-services/Documents/eis-css-assessment-schedule.pdf";

  const container = document.getElementById("scheduleContent");

  if (!container) return;

  container.innerHTML = `
  <p>
    <a href="${scheduleUrl}" target="_blank" rel="noopener">
      Open the Cybersecurity Assessment Schedule (PDF)
    </a>
  </p>
  `;
}

loadAssessmentSchedule();

// ==========================
// Tab Configuration
// ==========================
const markdownTabs = {

request: {
url: "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/Artifact-Request.md",
container: "artifactContent"
},

collector: {
url: "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/Artifact-Collector-Powershell-Scripts.md",
container: "collectorContent"
},

index: {
url: "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/CSS-Assessment-Index.md",
container: "indexContent"
},

relationships: {
url: "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/CSS-Assessment-Safeguard-Interrelationships.md",
container: "relationshipsContent"
},

kql: {
url: "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/Defender-KQL.md",
container: "kqlContent"
},

grouppolicy: {
url: "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/Group-Policy-Settings.md",
container: "grouppolicyContent"
},

recommend: {
url: "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/Implementation-Recommendations.md",
container: "recommendContent"
}

};

// ==========================
// Tabs
// ==========================
document.querySelectorAll(".tab").forEach((tab) => {

  tab.addEventListener("click", async () => {

    const tabName = tab.dataset.tab;

    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.toggle("active", t === tab);
      t.setAttribute("aria-selected", t === tab ? "true" : "false");
    });

    document.querySelectorAll(".panel").forEach((p) => {
      p.classList.toggle("active", p.id === `panel-${tabName}`);
    });

    if (markdownTabs[tabName]) {
      const cfg = markdownTabs[tabName];

      await loadMarkdown(cfg.url, cfg.container, cfg.error);
    }

  });

});

// ==========================
// Load JSON Data
// ==========================
async function loadData() {

  try {

    const response = await fetch("guidance.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Templates
    const tl = document.getElementById("templateList");

    if (tl && data.templates) {

      tl.innerHTML = data.templates.map((t) => `
        <li>
          <a href="${t.href}" target="_blank" rel="noopener">${t.name}</a>
          — <span>${t.desc}</span>
        </li>
      `).join("");
    }

    // FAQ
    const faq = document.getElementById("faqList");

    if (faq && data.faq) {

      faq.innerHTML = data.faq.map((q) => `
        <details>
          <summary>${q.q}</summary>
          <p>${q.a}</p>
        </details>
      `).join("");
    }

    // Resources
    if (data.resources) {

      const rDocs = document.getElementById("resourceDocs");
      const rLinks = document.getElementById("resourceLinks");

      if (rDocs && data.resources.docs) {

        rDocs.innerHTML = data.resources.docs.map((r) => `
          <li>
            <a href="${r.href}" target="_blank" rel="noopener">${r.name}</a>
          </li>
        `).join("");
      }

      if (rLinks && data.resources.links) {

        rLinks.innerHTML = data.resources.links.map((r) => `
          <li>
            <a href="${r.href}" target="_blank" rel="noopener">${r.name}</a>
          </li>
        `).join("");
      }
    }

    // Announcements
    const ann = document.getElementById("announcementsList");

    if (ann && data.announcements) {

      ann.innerHTML = data.announcements.map((a) => `
        <li><strong>${a.date}</strong> — ${a.text}</li>
      `).join("");
    }

    // Timeline
    const rm = document.getElementById("roadmapList");

    if (rm && data.timeline) {

      rm.innerHTML = data.timeline.map((r) => `
        <li><strong>${r.quarter}</strong>: ${r.items.join(", ")}</li>
      `).join("");
    }

  } catch (err) {

    console.error("Failed to load guidance.json:", err);

  }

}

loadData();

// ========================================
// Portal Script - Static, No JSON Version
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initFooterYear();
  initSearch();
  loadAssessmentSchedule();
  initTabs();
  loadGuidanceStatic();
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

  input.addEventListener("input", (e) => {
    const query = (e.target.value || "").toLowerCase();
    document.querySelectorAll(".card").forEach((card) => {
      card.style.display = card.innerText.toLowerCase().includes(query) ? "" : "none";
    });
  });
}

// ========================================
// Load Assessment Schedule
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
function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;
      activateTab(tab);
      activatePanel(tabName);
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
// Load Static Guidance
// ========================================
function loadGuidanceStatic() {
  // --- Templates ---
  const templateList = document.getElementById("templateList");
  if (templateList) {
    const templates = [
      { name: "Template1.docx", href: "assets/Template1.docx", desc: "Description for Template1 document." },
      { name: "Template2.docx", href: "assets/Template2.docx", desc: "Description for Template2 document." },
      { name: "SelfAssessmentWorkbook.xlsx", href: "assets/SelfAssessmentWorkbook.xlsx", desc: "Description for SelfAssessmentWorkbook.xlsx" },
    ];
    templateList.innerHTML = templates
      .map((t) => `<li><a href="${t.href}" target="_blank">${t.name}</a> — ${t.desc}</li>`)
      .join("");
  }

  // --- FAQ ---
  const faqList = document.getElementById("faqList");
  if (faqList) {
    const faq = [
      { q: "Question # 1", a: "Answer to question 1." },
      { q: "Question # 2", a: "Answer to question 2." },
      { q: "Question # 3", a: "Answer to question 3." },
    ];
    faqList.innerHTML = faq
      .map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`)
      .join("");
  }

  // --- Resources ---
  const docs = document.getElementById("resourceDocs");
  const links = document.getElementById("resourceLinks");
  if (docs) {
    const resourcesDocs = [
      { name: "Statewide Policy", href: "https://example.org/handbook" },
      { name: "Others?", href: "https://example.org/others" },
    ];
    docs.innerHTML = resourcesDocs.map((r) => `<li><a href="${r.href}" target="_blank">${r.name}</a></li>`).join("");
  }
  if (links) {
    const resourcesLinks = [
      { name: "Center for Internet Security Control Assessment Specifications", href: "https://example.org" },
      { name: "GitHub KQL", href: "https://kql.scripts" },
      { name: "Others?", href: "https://example.org" },
    ];
    links.innerHTML = resourcesLinks.map((r) => `<li><a href="${r.href}" target="_blank">${r.name}</a></li>`).join("");
  }

  // --- Announcements ---
  const ann = document.getElementById("announcementsList");
  if (ann) {
    const announcements = [
      { date: "2026-04-01", text: "Initial launch of the Guidance Portal" },
      { date: "2026-04-15", text: "Added Release Readiness checklist" },
    ];
    ann.innerHTML = announcements.map((a) => `<li><strong>${a.date}</strong> — ${a.text}</li>`).join("");
  }

  // --- Timeline ---
  const roadmap = document.getElementById("roadmapList");
  if (roadmap) {
    const timeline = [
      { quarter: "Q2 2026", items: ["Add role-based views", "Embed dashboards", "Localization"] },
      { quarter: "Q3 2026", items: ["Versioned guidance sets", "Approval workflow"] },
    ];
    roadmap.innerHTML = timeline.map((r) => `<li><strong>${r.quarter}</strong>: ${r.items.join(", ")}</li>`).join("");
  }
}

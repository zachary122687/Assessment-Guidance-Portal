// -----------------------------
// Theme Toggle
// -----------------------------
const root = document.documentElement;
const toggle = document.getElementById("themeToggle");

if (!root.dataset.theme) root.dataset.theme = "light";

if (toggle) {
  toggle.textContent = root.dataset.theme === "dark" ? "🌙" : "☀️";

  toggle.addEventListener("click", () => {
    const newTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = newTheme;
    toggle.textContent = newTheme === "dark" ? "🌙" : "☀️";
  });
}


// -----------------------------
// Tabs
// -----------------------------
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.tab;

    document.querySelectorAll(".tab").forEach(t =>
      t.classList.toggle("active", t === tab)
    );

    document.querySelectorAll(".panel").forEach(panel => {
      panel.classList.toggle("active", panel.id === `panel-${tabName}`);
    });
  });
});


// -----------------------------
// Footer Year
// -----------------------------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


// -----------------------------
// Load Portal JSON Data
// -----------------------------
async function loadData() {
  try {
    const response = await fetch("guidance.json");
    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

    const data = await response.json();

    // ---- Important Documents ----
    if (data.importantDocuments) {
      for (const [key, items] of Object.entries(data.importantDocuments)) {
        const ul = document.getElementById(`bp-${key}`);
        if (!ul) continue;

        ul.innerHTML = items.map(i => `<li>${i}</li>`).join("");
      }
    }

    // ---- Templates ----
    const templateList = document.getElementById("templateList");
    if (templateList && data.templates) {
      templateList.innerHTML = data.templates.map(t => `
        <li>
          <a href="${t.href}" target="_blank" rel="noopener">${t.name}</a>
          — <span>${t.desc}</span>
        </li>
      `).join("");
    }

    // ---- FAQ ----
    const faqList = document.getElementById("faqList");
    if (faqList && data.faq) {
      faqList.innerHTML = data.faq.map(q => `
        <details>
          <summary>${q.q}</summary>
          <p>${q.a}</p>
        </details>
      `).join("");
    }

    // ---- Resources ----
    if (data.resources) {
      const docs = document.getElementById("resourceDocs");
      const links = document.getElementById("resourceLinks");

      if (docs && data.resources.docs) {
        docs.innerHTML = data.resources.docs.map(r =>
          `<li><a href="${r.href}" target="_blank" rel="noopener">${r.name}</a></li>`
        ).join("");
      }

      if (links && data.resources.links) {
        links.innerHTML = data.resources.links.map(r =>
          `<li><a href="${r.href}" target="_blank" rel="noopener">${r.name}</a></li>`
        ).join("");
      }
    }

    // ---- Announcements ----
    const announcements = document.getElementById("announcementsList");
    if (announcements && data.announcements) {
      announcements.innerHTML = data.announcements.map(a =>
        `<li><strong>${a.date}</strong> — ${a.text}</li>`
      ).join("");
    }

    // ---- Timeline ----
    const roadmap = document.getElementById("roadmapList");
    if (roadmap && data.timeline) {
      roadmap.innerHTML = data.timeline.map(r =>
        `<li><strong>${r.quarter}</strong>: ${r.items.join(", ")}</li>`
      ).join("");
    }

  } catch (err) {
    console.error("Failed to load guidance.json:", err);
  }
}


// -----------------------------
// Load Artifact Request from GitHub
// -----------------------------
async function loadArtifactRequest() {

  const url =
    "https://api.github.com/repos/stateoforegon-eis-css/Oregon-CIS-Assessments/contents/Artifact-Request.md";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const data = await response.json();

    // Decode Base64 markdown returned by GitHub
    const markdown = atob(data.content);

    const list = document.getElementById("bp-request");
    if (!list) return;

    list.innerHTML = "";

    const lines = markdown.split("\n");

    lines.forEach(line => {
      const clean = line.replace(/^[-*#\s]+/, "").trim();
      if (!clean) return;

      const li = document.createElement("li");
      li.textContent = clean;
      list.appendChild(li);
    });

  } catch (err) {
    console.error("Failed to load Artifact Request from GitHub:", err);
  }
}


// -----------------------------
// Search Function
// -----------------------------
const searchInput = document.getElementById("searchInput");

searchInput?.addEventListener("input", (e) => {
  const q = (e.target.value || "").toLowerCase();

  document.querySelectorAll(".card").forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(q) ? "" : "none";
  });
});


// -----------------------------
// Initialize Portal
// -----------------------------
loadData();
loadArtifactRequest();

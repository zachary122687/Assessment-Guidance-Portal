// ==========================
// Theme Toggle
// ==========================
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');

if (!root.dataset.theme) root.dataset.theme = 'light';
if (toggle) toggle.textContent = root.dataset.theme === 'dark' ? '🌙' : '☀️';

toggle?.addEventListener('click', () => {
  const newTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = newTheme;
  toggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
});

// ==========================
// Tabs Functionality
// ==========================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;

    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('active', p.id === `panel-${tabName}`));
  });
});

// ==========================
// Footer Year
// ==========================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ==========================
// Load JSON Data
// ==========================
async function loadData() {
  try {
    const response = await fetch('guidance.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Important Documents
    if (data.importantDocuments) {
      for (const [key, items] of Object.entries(data.importantDocuments)) {
        const ul = document.getElementById(`bp-${key}`);
        if (!ul) continue;
        ul.innerHTML = items.map(i => `<li>${i}</li>`).join('');
      }
    }

    // Templates
    const tl = document.getElementById('templateList');
    if (tl && data.templates) {
      tl.innerHTML = data.templates.map(t =>
        `<li><a href="${t.href}" target="_blank" rel="noopener">${t.name}</a> — <span>${t.desc}</span></li>`
      ).join('');
    }

    // FAQ
    const faq = document.getElementById('faqList');
    if (faq && data.faq) {
      faq.innerHTML = data.faq.map(q =>
        `<details><summary>${q.q}</summary><p>${q.a}</p></details>`
      ).join('');
    }

    // Resources
    if (data.resources) {
      const rDocs = document.getElementById('resourceDocs');
      const rLinks = document.getElementById('resourceLinks');
      if (rDocs && data.resources.docs) rDocs.innerHTML = data.resources.docs.map(r =>
        `<li><a href="${r.href}" target="_blank" rel="noopener">${r.name}</a></li>`).join('');
      if (rLinks && data.resources.links) rLinks.innerHTML = data.resources.links.map(r =>
        `<li><a href="${r.href}" target="_blank" rel="noopener">${r.name}</a></li>`).join('');
    }

    // Announcements
    const ann = document.getElementById('announcementsList');
    if (ann && data.announcements) {
      ann.innerHTML = data.announcements.map(a => `<li><strong>${a.date}</strong> — ${a.text}</li>`).join('');
    }

    // Timeline
    const rm = document.getElementById('roadmapList');
    if (rm && data.timeline) {
      rm.innerHTML = data.timeline.map(r => `<li><strong>${r.quarter}</strong>: ${r.items.join(', ')}</li>`).join('');
    }

  } catch (err) {
    console.error('Failed to load guidance.json:', err);
  }
}

loadData();

// ==========================
// Search Functionality
// ==========================
const searchInput = document.getElementById('searchInput');
searchInput?.addEventListener('input', (e) => {
  const q = (e.target.value || '').toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
});

// ==========================
// Load Assessment Schedule PDF
// ==========================
function loadAssessmentSchedule() {
  const scheduleUrl = "https://www.oregon.gov/eis/cyber-security-services/Documents/eis-css-assessment-schedule.pdf";
  const container = document.getElementById("scheduleContent");
  if (!container) return;

  container.innerHTML = `<p><a href="${scheduleUrl}" target="_blank" rel="noopener">
    Click here to open the Cybersecurity Assessment Schedule (PDF)
  </a></p>`;
}

loadAssessmentSchedule();

// ==========================
// Load Artifact Request and Collector from GitHub
// ==========================
async function loadMarkdown(url, containerId, fallbackMessage) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const res = await fetch(url);
    const markdown = await res.text();
    container.innerHTML = marked.parse(markdown);
  } catch (err) {
    container.innerHTML = fallbackMessage;
    console.error(err);
  }
}

// Artifact Request
loadMarkdown(
  "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/Artifact-Request.md",
  "artifactContent",
  "Failed to load Artifact Request document."
);

// Artifact Collector
loadMarkdown(
  "https://raw.githubusercontent.com/stateoforegon-eis-css/Oregon-CIS-Assessments/main/Artifact-Collector-Powershell-Scripts.md",
  "bp-collector",
  "Failed to load Artifact Collector document."
);

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

    document.querySelectorAll(".card").forEach(card => {

      card.style.display =
        card.innerText.toLowerCase().includes(q) ? "" : "none";

    });

  }, 200);

});


// ==========================
// Markdown Loader
// ==========================
async function loadMarkdown(url, containerId) {

  const container = document.getElementById(containerId);

  if (!container) return;

  if (container.dataset.loaded === "true") return;

  container.innerHTML = "Loading...";

  try {

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const markdown = await res.text();

    container.innerHTML = marked.parse(markdown);

    container.dataset.loaded = "true";

  } catch (err) {

    console.error("Markdown load failed:", err);

    container.innerHTML = "<p style='color:red'>Failed to load document.</p>";

  }

}


// ==========================
// Assessment Schedule
// ==========================
function loadAssessmentSchedule() {

  const container = document.getElementById("scheduleContent");

  if (!container) return;

  const url =
  "https://www.oregon.gov/eis/cyber-security-services/Documents/eis-css-assessment-schedule.pdf";

  container.innerHTML = `
  <p>
    <a href="${url}" target="_blank">
      Open Cybersecurity Assessment Schedule (PDF)
    </a>
  </p>
  `;

}

loadAssessmentSchedule();


// ==========================
// Markdown Tab Map
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
// Tab System
// ==========================
document.querySelectorAll(".tab").forEach(tab => {

  tab.addEventListener("click", async () => {

    const tabName = tab.dataset.tab;

    console.log("Tab:", tabName);

    // activate tab button
    document.querySelectorAll(".tab").forEach(t =>
      t.classList.toggle("active", t === tab)
    );

    // activate panel
    document.querySelectorAll(".panel").forEach(p =>
      p.classList.toggle("active", p.id === `panel-${tabName}`)
    );

    // load markdown if configured
    const config = markdownTabs[tabName];

    if (config) {

      await loadMarkdown(config.url, config.container);

    }

  });

});

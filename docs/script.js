// Theme toggle
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');

if (!root.dataset.theme) root.dataset.theme = 'light'; // default

toggle?.addEventListener('click', () => {
  const newTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = newTheme;
  toggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
});

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const current = tab.dataset.tab;
    document.querySelectorAll('.tab')
      .forEach(t => t.classList.toggle('active', t === tab));

    document.querySelectorAll('.panel')
      .forEach(p => p.classList.toggle('active', p.id === `panel-${current}`));
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Load JSON data
async function loadData() {
  try {
    const res = await fetch('guidance.json');
    const data = await res.json();

    // Best practices / Important Documents
    for (const [key, items] of Object.entries(data.bestPractices)) {
      const ul = document.getElementById(`bp-${key}`);
      if (!ul) continue;
      ul.innerHTML = items.map(i => `<li>${i}</li>`).join('');
    }

    // Checklists
    const cl = document.getElementById('checklistCards');
    if (cl && data.checklists)
      cl.innerHTML = data.checklists.map(list => `
        <div class="tile">
          <h3>${list.title}</h3>
          <ul>${list.items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
      `).join('');

    // Templates
    const tl = document.getElementById('templateList');
    if (tl)
      tl.innerHTML = data.templates.map(t => `
        <li><a href="${t.href}" target="_blank">${t.name}</a> — <span>${t.desc}</span></li>
      `).join('');

    // FAQ
    const faq = document.getElementById('faqList');
    if (faq)
      faq.innerHTML = data.faq.map(q => `
        <details>
          <summary>${q.q}</summary>
          <p>${q.a}</p>
        </details>
      `).join('');

    // Resources
    if (data.resources) {
      const docs = document.getElementById('resourceDocs');
      if (docs)
        docs.innerHTML = data.resources.docs.map(r => `<li><a href="${r.href}" target="_blank">${r.name}</a></li>`).join('');
    }

    // Announcements
    const ann = document.getElementById('announcementsList');
    if (ann)
      ann.innerHTML = data.announcements.map(a => `<li><strong>${a.date}</strong> — ${a.text}</li>`).join('');

    // Roadmap
    const rm = document.getElementById('roadmapList');
    if (rm)
      rm.innerHTML = data.timeline.map(r => `<li><strong>${r.quarter}</strong>: ${r.items.join(', ')}</li>`).join('');

  } catch (e) {
    console.error('Failed to load guidance.json:', e);
  }
}

loadData();

// Search functionality
const searchInput = document.getElementById('searchInput');
searchInput?.addEventListener('input', (e) => {
  const q = (e.target.value || '').toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(q) ? '' : 'none';
  });
});

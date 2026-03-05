// Theme toggle
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');

// Set default theme if none
if (!root.dataset.theme) root.dataset.theme = 'light';

// Set toggle button icon on load
toggle.textContent = root.dataset.theme === 'dark' ? '🌙' : '☀️';

toggle?.addEventListener('click', () => {
  const newTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = newTheme;
  toggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
});

// Tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const current = tab.dataset.tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.panel').forEach(p => {
      p.classList.toggle('active', p.id === `panel-${current}`);
    });
  });
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Load JSON data
async function loadData() {
  try {
    const res = await fetch('guidance.json');
    const data = await res.json();

    // Important Documents
    if (data.importantDocuments) {
      for (const [key, items] of Object.entries(data.importantDocuments)) {
        const ul = document.getElementById(`bp-${key}`);
        if (!ul) continue;
        ul.innerHTML = items.map(i => `<li>${i}</li>`).join('');
      }
    }

    // Checklists
    const cl = document.getElementById('checklistCards');
    if (cl && data.checklists) {
      cl.innerHTML = data.checklists.map(list => `
        <div class="tile">
          <h3>${list.title}</h3>
          <ul>${list.items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
      `).join('');
    }

    // Templates
    const tl = document.getElementById('templateList');
    if (tl && data.templates) {
      tl.innerHTML = data.templates.map(t => `
        <li><a href="${t.href}" target="_blank" rel="noopener">${t.name}</a> — <span>${t.desc}</span></li>
      `).join('');
    }

    // FAQ
    const faq = document.getElementById('faqList');
    if (faq && data.faq) {
      faq.innerHTML = data.faq.map(q => `
        <details>
          <summary>${q.q}</summary>
          <p>${q.a}</p>
        </details>
      `).join('');
    }

    // Resources
    if (data.resources) {
      const docs = document.getElementById('resourceDocs');
      if (docs && data.resources.docs) {
        docs.innerHTML = data.resources.docs.map(r => `<li><a href="${r.href}" target="_blank" rel="noopener">${r.name}</a></li>`).join('');
      }
      const links = document.getElementById('resourceLinks');
      if (links && data.resources.links) {
        links.innerHTML = data.resources.links.map(l => `<li><a href="${l.href}" target="_blank" rel="noopener">${l.name}</a></li>`).join('');
      }
    }

    // Announcements
    const ann = document.getElementById('announcementsList');
    if (ann && data.announcements) {
      ann.innerHTML = data.announcements.map(a => `<li><strong>${a.date}</strong> — ${a.text}</li>`).join('');
    }

    // Roadmap / Timeline
    const rm = document.getElementById('roadmapList');
    if (rm && data.timeline) {
      rm.innerHTML = data.timeline.map(r => `<li><strong>${r.quarter}</strong>: ${r.items.join(', ')}</li>`).join('');
    }

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

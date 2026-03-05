// Theme toggle
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');

toggle?.addEventListener('click', () => {
  const isDark = root.dataset.theme !== 'light';
  root.dataset.theme = isDark ? 'light' : 'dark';

  const light = {
    '--bg': '#f7f8fb',
    '--card': '#ffffff',
    '--text': '#1b2130',
    '--muted': '#5e6a7e',
    '--border': '#e3e7ee'
  };

  if (isDark) Object.entries(light).forEach(([k,v]) => root.style.setProperty(k, v));
  else Object.keys(light).forEach(k => root.style.removeProperty(k));
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
document.getElementById('year').textContent = new Date().getFullYear();

// Load JSON data
async function loadData() {
  try {
    const res = await fetch('guidance.json');
    const data = await res.json();

    // Important Documents
    const docKeys = ['schedule', 'request', 'collector'];
    docKeys.forEach(key => {
      const ul = document.getElementById(`bp-${key}`);
      if (!ul) return;
      const items = data.importantDocuments?.[key] || [];
      ul.innerHTML = items.map(i => `<li>${i}</li>`).join('');
    });

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
    if (tl && data.templates)
      tl.innerHTML = data.templates.map(t => `
        <li><a href="${t.href}" target="_blank">${t.name}</a> — <span>${t.desc}</span></li>
      `).join('');

    // FAQ
    const faq = document.getElementById('faqList');
    if (faq && data.faq)
      faq.innerHTML = data.faq.map(q => `
        <details>
          <summary>${q.q}</summary>
          <p>${q.a}</p>
        </details>
      `).join('');

    // Resources
    if (data.resources) {
      const docsEl = document.getElementById('resourceDocs');
      if (docsEl)
        docsEl.innerHTML = data.resources.docs.map(r => `<li><a href="${r.href}" target="_blank">${r.name}</a></li>`).join('');

      const linksEl = document.getElementById('resourceLinks');
      if (linksEl)
        linksEl.innerHTML = data.resources.links.map(r => `<li><a href="${r.href}" target="_blank">${r.name}</a></li>`).join('');
    }

    // Announcements
    const ann = document.getElementById('announcementsList');
    if (ann && data.announcements)
      ann.innerHTML = data.announcements.map(a => `<li><strong>${a.date}</strong> — ${a.text}</li>`).join('');

    // Roadmap
    const rm = document.getElementById('roadmapList');
    if (rm && data.roadmap)
      rm.innerHTML = data.roadmap.map(r => `<li><strong>${r.quarter}</strong>: ${r.items.join(', ')}</li>`).join('');

  } catch (e) {
    console.error('Failed to load guidance.json:', e);
  }
}

loadData();

// Client-side search
const searchInput = document.getElementById('searchInput');
searchInput?.addEventListener('input', (e) => {
  const q = (e.target.value || '').toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(q) ? '' : 'none';
  });
});

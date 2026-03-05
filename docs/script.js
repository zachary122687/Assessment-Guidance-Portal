// Theme toggle
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
toggle?.addEventListener('click', () => {
  const isDark = root.dataset.theme !== 'light';
  root.dataset.theme = isDark ? 'light' : 'dark';
  const light = {
    '--bg': '#f7f8fb', '--card': '#ffffff', '--text': '#1b2130',
    '--muted': '#5e6a7e', '--border': '#e3e7ee'
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
      const is = p.id === `panel-${current}`;
      p.classList.toggle('active', is);
    });
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Data-driven content
async function loadData() {
  try {
    const res = await fetch('guidance.json');
    const data = await res.json();

    // Best practices
    for (const [key, items] of Object.entries(data.bestPractices)) {
      const ul = document.getElementById(`bp-${key}`);
      if (!ul) continue;
      ul.innerHTML = items.map(i => `<li>${i}</li>`).join('');
    }

    // Checklists
    const cl = document.getElementById('checklistCards');
    cl.innerHTML = data.checklists.map(list => `
      <div class="tile">
        <h3>${list.title}</h3>
        <ul>${list.items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    `).join('');

    // Templates
    const tl = document.getElementById('templateList');
    tl.innerHTML = data.templates.map(t => `
      <li><a href="${t.name}</a> — <span>${t.desc}</span></li>
    `).join('');

    // FAQ
    const faq = document.getElementById('faqList');
    faq.innerHTML = data.faq.map(q => `
      <details>
        <summary>${q.q}</summary>
        <p>${q.a}</p>
      </details>
    `).join('');

    // Resources
    document.getElementById('resourceDocs').innerHTML =
      data.resources.docs.map(r => `<li><a href="${r.href}" target>`).join('');
    document.getElementById('resourceCommunity').innerHTML =
      data.resources.community.map(r => `<li><{r.href}${r.name}</a></li>`).join('');

    // Announcements
    document.getElementById('announcementsList').innerHTML =
      data.announcements.map(a => `<li><strong>${a.date}</strong> — ${a.text}</li>`).join('');

    // Roadmap
    document.getElementById('roadmapList').innerHTML =
      data.roadmap.map(r => `<li><strong>${r.quarter}</strong>: ${r.items.join(', ')}</li>`).join('');
  } catch (e) {
    console.error('Failed to load guidance.json:', e);
  }
}
loadData();

// Client-side search
const searchInput = document.getElementById('searchInput');
searchInput?.addEventListener('input', (e) => {
  const q = (e.target.value || '').toLowerCase();
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {

    // Match in headings or list items within the card
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(q) ? '' : 'none';
  });
});

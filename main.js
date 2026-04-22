// Helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const DAY = '2026-04-30', Z = '00:00';

// Testing
function getNowMs() {
  const params = new URLSearchParams(location.search);
  const nowParam = params.get('now');
  const offsetMin = params.get('offset');
  if (nowParam) {
    const d = new Date(nowParam);
    if (!isNaN(d)) return d.getTime();
  }
  if (offsetMin) {
    const n = Number(offsetMin);
    if (!isNaN(n)) return Date.now() + n * 60000;
  }
  return Date.now();
}

// Schedule Info (Data)
const schedule = [
  
  {
    id: 'arrival',
    start: `${DAY}T09:00:00${Z}`,
    end: `${DAY}T09:30:00${Z}`,
    title: 'Van Pick-up',
    desc: 'Van pick-up at Tour Alarm.'
  },
  {
    id: 'fireside',
    start: `${DAY}T09:45:00${Z}`,
    end: `${DAY}T10:00:00${Z}`,
    title: 'Pick-up Mela',
    desc: 'Mela address.'
  },
  {
    id: 'wealth',
    start: `${DAY}T10:15:00${Z}`,
    end: `${DAY}T10:30:00${Z}`,
    title: 'Pick-up Lilian, Merch and Guitar Cab',
  },
  {
    id: 'break1',
    start: `${DAY}T10:30:00${Z}`,
    end: `${DAY}T13:30:00${Z}`,
    title: 'Travel - first half.',
  },
  {
    id: 'founders',
    start: `${DAY}T13:30:00${Z}`,
    end: `${DAY}T14:00:00${Z}`,
    title: 'Lunch Break',
    desc: 'Stop on the road on a place with oudoor seating area.'
  },
  {
    id: 'circle',
    start: `${DAY}T14:00:00${Z}`,
    end: `${DAY}T18:00:00${Z}`,
    title: 'Second half of the driving',
  },
  {
    id: 'lunch',
    start: `${DAY}T18:00:00${Z}`,
    end: `${DAY}T18:10:00${Z}`,
    title: 'Get-in / Doors',
  },
  {
    id: 'ai',
    start: `${DAY}T20:30:00${Z}`,
    end: `${DAY}T22:30:00${Z}`,
    title: 'Pick-up Eunice at the Airport',
  },
  {
    id: 'mental',
    start: `${DAY}T22:30:00${Z}`,
    end: `${DAY}T23:30:00${Z}`,
    title: 'Drive Eunice to the gig',
   },
  {
    id: 'content',
    start: `${DAY}T23:30:00${Z}`,
    end: `${DAY}T23:40:00${Z}`,
    title: 'Setting stage',
    },
  {
    id: 'executive',
    start: `${DAY}T23:40:00${Z}`,
    end: `${DAY}T23:59:00${Z}`,
    title: 'STAGE-TIME',
   },
  {
    id: 'skills',
    start: `${DAY}T23:59:00${Z}`,
    end: `${DAY}T23:59:00${Z}`,
    title: 'VAN CALL - Drive to the Hostel',
  },
];

// Render Logic
function fmt(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
function within(now, s, e) { return now >= new Date(s) && now < new Date(e); }
function past(now, e) { return now >= new Date(e); }

function renderList(mode = 'all') {
  const now = getNowMs();
  let filtered = schedule;

  if (mode === 'now') filtered = schedule.filter(s => within(now, s.start, s.end));
  else if (mode === 'past') filtered = schedule.filter(s => past(now, s.end));

  const html = filtered.map(s => {
    const isCurrent = within(now, s.start, s.end);
    const isPast = past(now, s.end);
    const cls = isCurrent ? 'session current' : isPast ? 'session past' : 'session';

    let imgHTML = '';
    if (Array.isArray(s.img)) {
      imgHTML = s.img.map(url => `<img class="speaker-pic" src="${url}" alt="${s.speaker || s.title}">`).join('');
    } else if (s.img) {
      imgHTML = `<img class="speaker-pic" src="${s.img}" alt="${s.speaker || s.title}">`;
    }

    return `
      <article id="${s.id}" class="${cls}">
        <div class="session-header">
          <h3>${s.title}${isCurrent ? '<span class="live-tag">LIVE</span>' : ''}</h3>
          <button class="toggle-arrow" aria-label="Toggle details">▼</button>
        </div>
        <small>${fmt(s.start)}–${fmt(s.end)}${s.speaker ? ` · ${s.speaker}` : ''}</small>
        <div class="session-body">
          <p class="desc">${s.desc}</p>
          ${imgHTML}
        </div>
      </article>`;
  }).join('');

  $('#schedule').innerHTML = html;

  // Accordion logic — only one expanded
  $$('#schedule article').forEach(el => {
    const btn = el.querySelector('.toggle-arrow');
    const header = el.querySelector('.session-header');

    const toggle = () => {
      const isExpanded = el.classList.contains('expanded');
      $$('#schedule article.expanded').forEach(other => {
        if (other !== el) {
          other.classList.remove('expanded');
          const otherBtn = other.querySelector('.toggle-arrow');
          if (otherBtn) otherBtn.textContent = '▼';
        }
      });
      el.classList.toggle('expanded', !isExpanded);
      btn.textContent = el.classList.contains('expanded') ? '▲' : '▼';
    };

    btn.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    header.addEventListener('click', e => { if (!e.target.classList.contains('toggle-arrow')) toggle(); });
  });

  renderBanner(now);
}

// Banner
function renderBanner(now) {
  const current = schedule.find(s => within(now, s.start, s.end));
  const next = schedule.find(s => new Date(s.start) > now);
  const banner = $('#liveBanner');

  if (current) {
    banner.innerHTML = `<div class="box"><strong>NOW:</strong> ${current.title}</div>`;
    return;
  }

  const summitStart = new Date(`${DAY}T00:00:00${Z}`).getTime();
  const hourSwitch = new Date(`${DAY}T00:01:00${Z}`).getTime();
  const minuteSwitch = new Date(`${DAY}T08:00:00${Z}`).getTime();

  if (next) {
    const diffMs = new Date(next.start).getTime() - now;
    let timeStr;

    // Before event day — show in days
    if (now < summitStart) {
      const days = Math.ceil((summitStart - now) / (1000 * 60 * 60 * 24));
      timeStr = `${days} day${days !== 1 ? 's' : ''}`;
    }
    // After midnight but before 8 am — show in hours
    else if (now >= hourSwitch && now < minuteSwitch) {
      const hours = Math.ceil(diffMs / (1000 * 60 * 60));
      timeStr = `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    // After 8 am on the day — show in minutes
    else {
      const mins = Math.ceil(diffMs / 60000);
      timeStr = `${mins} min`;
    }

    banner.innerHTML = `<div class="box"><span class="upnext">UP NEXT:</span> ${next.title} &#x203A; in ${timeStr}</div>`;
  } else {
    banner.innerHTML = '';
  }
}

// In(n)it
document.addEventListener('DOMContentLoaded', () => {
  const tz = $('#tzLabel');
  if (tz) tz.textContent = 'CET (UTC+1)';

  renderList('all');
  setInterval(() => renderList('all'), 30000);

  $('#showAll').onclick = () => renderList('all');
  $('#showCurrent').onclick = () => renderList('now');
  $('#showPast').onclick = () => renderList('past');
  $('#scrollTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
});

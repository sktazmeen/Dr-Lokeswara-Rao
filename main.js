/* ═══════════════════════════════════════════════════════════════
   Dr. Pelluru Portfolio – main.js
   Fetches content.json and builds the entire DOM dynamically.
   Also handles: AOS init, navbar, mobile menu, counters,
   smooth scroll, scroll-to-top, gallery fallbacks, form submit.
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Helper: safe HTML tag builder ── */
const el = (tag, cls = '', html = '') => {
  const e = document.createElement(tag);
  if (cls)  e.className  = cls;
  if (html) e.innerHTML  = html;
  return e;
};

/* ── Placeholder image URL when local image is missing ── */
const placeholder = (bg, label) =>
  `https://placehold.co/600x400/${bg}/ffffff?text=${encodeURIComponent(label)}`;

/* ───────────────────────────────────────
   1.  FETCH CONTENT & BOOTSTRAP
─────────────────────────────────────── */
async function init() {
 // let data;
 // try {
   // const res = await fetch('content.json');
  //  if (!res.ok) throw new Error('Failed to load content.json');
   // data = await res.json();
   
 // } 
  
  try {
    if (!data) throw new Error('Data object is missing');
  }
  catch (err) {
    console.error(err);
    document.body.innerHTML = `<p style="padding:2rem;color:red;">
      Could not load content.json — make sure it is served from the same folder.</p>`;
    return;
  }

  /* Update page title */
  document.title = data.site.title;

  /* Build each section */
  buildNavbar(data.navbar);
  buildHero(data.hero);
  buildAbout(data.about);
  buildExpertise(data.expertise);
  buildExperience(data.experience);
  buildAchievements(data.achievements);
  buildProcedures(data.procedures);
  buildCommunity(data.community, data.network);
  buildGallery(data.gallery);
  buildPhilosophy(data.philosophy);
  buildContact(data.contact);
  buildFooter(data.footer);

  /* Behaviours */
  setupNavbar();
  setupMobileMenu();
  setupSmoothScroll();
  setupScrollTop();
  setupCounters(data.hero.stats);

  /* AOS */
  AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic', offset: 60 });

  /* Lightbox config (loaded via CDN) */
  if (typeof lightbox !== 'undefined') {
    lightbox.option({ resizeDuration: 200, wrapAround: true });
  }

  /* Hide loader */
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('hide');
    setTimeout(() => loader.remove(), 500);
  }
}

/* ───────────────────────────────────────
   2.  NAVBAR
─────────────────────────────────────── */
function buildNavbar(nav) {
  const navbar = document.getElementById('navbar');

  /* Logo */
  const logoWrap = navbar.querySelector('#nav-logo');
  logoWrap.innerHTML = `
    <a href="#home" class="flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
        <i class="fa-solid fa-heart-pulse text-white text-base"></i>
      </div>
      <div>
        <p class="text-white font-bold text-sm leading-tight drop-shadow">${nav.logo.name}</p>
        <p class="text-blue-200 text-xs">${nav.logo.subtitle}</p>
      </div>
    </a>`;

  /* Desktop links */
  const desktopLinks = navbar.querySelector('#nav-links');
  desktopLinks.innerHTML = nav.links
    .map(l => `<a href="${l.href}" class="nav-link">${l.label}</a>`)
    .join('') +
    `<a href="${nav.cta.href}" class="ml-3 bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg">${nav.cta.label}</a>`;

  /* Mobile links */
  const mobileLinks = navbar.querySelector('#mobile-nav-links');
  mobileLinks.innerHTML = nav.links
    .map(l => `<a href="${l.href}" class="mobile-nav px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-blue-50 hover:text-blue-700 transition block">${l.label}</a>`)
    .join('') +
    `<a href="${nav.cta.href}" class="mobile-nav mt-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center px-4 py-3 rounded-xl font-semibold block">${nav.cta.label}</a>`;
}

/* ───────────────────────────────────────
   3.  HERO
─────────────────────────────────────── */
function buildHero(hero) {
  const sec = document.getElementById('hero-section');

  const checklist = hero.checklist
    .map(item => `<div class="flex items-center gap-2 text-white/90 text-sm"><i class="fa-solid fa-circle-check text-emerald-400"></i>${item}</div>`)
    .join('');

  const buttons = hero.buttons.map(btn => {
    if (btn.style === 'primary')
      return `<a href="${btn.href}" class="bg-white text-blue-700 hover:bg-blue-50 px-7 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"><i class="fa-solid ${btn.icon} mr-2"></i>${btn.label}</a>`;
    return `<a href="${btn.href}" class="border border-white/40 text-white hover:bg-white/10 px-7 py-3 rounded-xl font-semibold text-sm transition-all backdrop-blur-sm">${btn.label} <i class="fa-solid ${btn.icon} ml-2"></i></a>`;
  }).join('');

  const stats = hero.stats.map(s => `
    <div class="stat-card">
      <p class="text-white text-2xl font-bold" id="${s.id}">0</p>
      <p class="text-blue-200 text-xs mt-1">${s.label}</p>
    </div>`).join('');

  sec.innerHTML = `
    <div class="hero-grid-pattern"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full relative">
      <div class="grid lg:grid-cols-2 gap-12 items-center">

        <!-- Left -->
        <div data-aos="fade-right" data-aos-duration="800">
          <div class="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>${hero.badge}
          </div>
          <h1 class="section-title text-4xl sm:text-5xl xl:text-6xl text-white mb-4">
            ${hero.name.replace('\n','<br/>').replace(hero.highlight, `<span class="text-cyan-300">${hero.highlight}</span>`)}
          </h1>
          <p class="text-blue-200 text-lg font-medium mb-2">${hero.role}</p>
          <p class="text-white/70 text-sm mb-8">${hero.meta}</p>
          <div class="flex flex-col sm:flex-row flex-wrap gap-2 mb-10">${checklist}</div>
          <div class="flex flex-wrap gap-4">${buttons}</div>
        </div>

        <!-- Right -->
        <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="150" class="flex flex-col items-center gap-8">
          <div class="relative">
            <div class="hero-pulse w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-white/20 to-white/5 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm shadow-2xl">
              <div class="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-400/20 flex items-center justify-center border border-white/20">
                <i class="fa-solid fa-user-doctor text-7xl text-white/80"></i>
              </div>
            </div>
            <div class="absolute -bottom-3 -right-3 bg-white rounded-2xl shadow-xl px-4 py-2 flex items-center gap-2">
              <i class="fa-solid fa-heart-pulse text-red-500 text-lg float-anim"></i>
              <div><p class="text-xs text-slate-500">Experience</p><p class="font-bold text-slate-800 text-sm">${hero.experience_badge.value} Years</p></div>
            </div>
            <div class="absolute -top-3 -left-3 bg-emerald-500 text-white rounded-xl px-3 py-1.5 text-xs font-semibold shadow-lg">
              <i class="fa-solid fa-shield-heart mr-1"></i>${hero.hospital_badge}
            </div>
          </div>
          <div class="grid grid-cols-3 gap-3 w-full max-w-sm">${stats}</div>
        </div>
      </div>
    </div>
    <div class="wave-divider">
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8fafc"/>
      </svg>
    </div>`;
}

/* ───────────────────────────────────────
   4.  ABOUT
─────────────────────────────────────── */
function buildAbout(about) {
  const sec = document.getElementById('about-section');

  const paragraphs = about.paragraphs.map(p => `<p class="text-slate-600 mt-4 leading-relaxed">${p}</p>`).join('');

  const colorMap = { blue:'blue', cyan:'cyan', emerald:'emerald' };
  const quals = about.qualifications.map(q => `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 icon-bg-${colorMap[q.color]||'blue'} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <i class="fa-solid ${q.icon} text-xs"></i>
      </div>
      <div>
        <p class="font-semibold text-slate-800 text-sm">${q.degree}</p>
        <p class="text-xs text-slate-500">${q.institution}</p>
      </div>
    </div>`).join('');

  /* Floating badge positions */
  const badgePos = ['absolute -bottom-5 -right-5', 'absolute -top-5 -left-5'];
  const badgeBg  = ['blue','cyan'];
  const badges = about.floating_badges.map((b,i) => `
    <div class="${badgePos[i]} bg-white rounded-2xl shadow-xl p-4 border border-blue-50 flex items-center gap-3">
      <div class="w-10 h-10 icon-bg-${badgeBg[i]} rounded-xl flex items-center justify-center">
        <i class="fa-solid ${b.icon} text-sm"></i>
      </div>
      <div><p class="font-bold text-slate-800 text-sm">${b.title}</p><p class="text-xs text-slate-500">${b.sub}</p></div>
    </div>`).join('');

  sec.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-16 items-center">

        <!-- Visual -->
        <div data-aos="fade-right" data-aos-duration="700" class="relative">
          <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-10 border border-blue-100">
            <div class="w-full h-72 flex items-center justify-center">
              <i class="fa-solid fa-stethoscope text-9xl text-blue-200"></i>
            </div>
          </div>
          ${badges}
        </div>

        <!-- Text -->
        <div data-aos="fade-left" data-aos-duration="700">
          <span class="section-badge">${about.badge}</span>
          <h2 class="section-title text-3xl sm:text-4xl mt-2">${about.heading.replace('\n','<br/>')}</h2>
          <div class="section-underline"></div>
          ${paragraphs}
          <div class="mt-8 space-y-3">
            <h3 class="text-blue-800 font-semibold text-sm uppercase tracking-wide">Qualifications</h3>
            ${quals}
          </div>
        </div>
      </div>
    </div>`;
}

/* ───────────────────────────────────────
   5.  EXPERTISE
─────────────────────────────────────── */
function buildExpertise(exp) {
  const sec = document.getElementById('expertise-section');

  const cards = exp.cards.map((c, i) => {
    const delay = (i % 3) * 60;
    return `
      <div class="expertise-card" data-aos="fade-up" data-aos-delay="${delay}">
        <div class="w-12 h-12 icon-bg-${c.color} rounded-2xl flex items-center justify-center mb-4">
          <i class="fa-solid ${c.icon} text-xl"></i>
        </div>
        <h3 class="font-semibold text-slate-800 mb-2">${c.title}</h3>
        <p class="text-slate-500 text-sm leading-relaxed">${c.desc}</p>
      </div>`;
  }).join('');

  sec.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14" data-aos="fade-up">
        <span class="section-badge">${exp.badge}</span>
        <h2 class="section-title text-3xl sm:text-4xl mt-2">${exp.heading}</h2>
        <div class="section-underline mx-auto"></div>
        <p class="text-slate-500 mt-5 max-w-xl mx-auto text-sm">${exp.subtext}</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
    </div>`;
}

/* ───────────────────────────────────────
   6.  EXPERIENCE (TIMELINE)
─────────────────────────────────────── */
function buildExperience(exp) {
  const sec = document.getElementById('experience-section');

  const items = exp.timeline.map((item, i) => {
    const tags = item.tags.map(t => `<span class="tag-${item.color} text-xs px-3 py-1 rounded-full font-medium">${t}</span>`).join('');
    return `
      <div class="relative" data-aos="fade-right" data-aos-delay="${i * 100}">
        <div class="timeline-dot dot-${item.color}" style="box-shadow-color: var(--tw-shadow-color)"></div>
        <div class="timeline-item">
          <div class="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <h3 class="font-bold text-slate-800 text-lg">${item.role}</h3>
              <p class="text-${item.color === 'slate' ? 'slate-500' : item.color + '-600'} font-semibold">${item.hospital}</p>
            </div>
            <span class="tag-${item.color} text-xs font-semibold px-3 py-1.5 rounded-full">${item.period}</span>
          </div>
          <p class="text-slate-600 text-sm leading-relaxed">${item.desc}</p>
          <div class="flex flex-wrap gap-2 mt-4">${tags}</div>
        </div>
      </div>`;
  }).join('');

  sec.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14" data-aos="fade-up">
        <span class="section-badge">${exp.badge}</span>
        <h2 class="section-title text-3xl sm:text-4xl mt-2">${exp.heading}</h2>
        <div class="section-underline mx-auto"></div>
      </div>
      <div class="timeline-wrapper">
        <div class="timeline-line"></div>
        ${items}
      </div>
    </div>`;
}

/* ───────────────────────────────────────
   7.  ACHIEVEMENTS
─────────────────────────────────────── */
function buildAchievements(ach) {
  const sec = document.getElementById('achievements-section');

  const cards = ach.stats.map((s, i) => `
    <div class="ach-card" data-aos="zoom-in" data-aos-delay="${i * 80}">
      <div class="w-14 h-14 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
        <i class="fa-solid ${s.icon} text-white text-2xl"></i>
      </div>
      <p class="text-4xl font-bold text-white mb-1">${s.value}</p>
      <p class="text-blue-200 text-sm">${s.label}</p>
    </div>`).join('');

  const bullets = ach.bullets.map(b => `
    <div class="flex items-center gap-3 text-white/90 text-sm">
      <i class="fa-solid fa-check-circle text-emerald-400 text-base flex-shrink-0"></i>${b}
    </div>`).join('');

  sec.innerHTML = `
    <div class="achievements-glow-1"></div>
    <div class="achievements-glow-2"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="text-center mb-14" data-aos="fade-up">
        <span class="inline-block bg-white/15 border border-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full mb-3">${ach.badge}</span>
        <h2 class="section-title text-white text-3xl sm:text-4xl mt-2">${ach.heading}</h2>
        <div class="w-14 h-1 bg-gradient-to-r from-cyan-400 to-blue-300 rounded-full mx-auto mt-4"></div>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">${cards}</div>
      <div class="mt-12 grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">${bullets}</div>
    </div>`;
}

/* ───────────────────────────────────────
   8.  PROCEDURES
─────────────────────────────────────── */
function buildProcedures(proc) {
  const sec = document.getElementById('procedures-section');

  const pills = proc.list.map(p => `<span class="proc-pill">${p}</span>`).join('');

  const why = proc.why_choose.points.map(pt => `
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 bg-${pt.color}-${pt.color === 'rose' ? '500' : '600'} rounded-lg flex items-center justify-center flex-shrink-0">
        <i class="fa-solid ${pt.icon} text-white text-xs"></i>
      </div>
      <p class="text-slate-700 text-sm">${pt.text}</p>
    </div>`).join('');

  sec.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14" data-aos="fade-up">
        <span class="section-badge">${proc.badge}</span>
        <h2 class="section-title text-3xl sm:text-4xl mt-2">${proc.heading}</h2>
        <div class="section-underline mx-auto"></div>
        <p class="text-slate-500 mt-5 max-w-xl mx-auto text-sm">${proc.subtext}</p>
      </div>
      <div class="flex flex-wrap gap-3 justify-center" data-aos="fade-up" data-aos-delay="100">${pills}</div>
      <div class="mt-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100" data-aos="fade-up">
        <h3 class="section-title text-2xl text-center mb-8">${proc.why_choose.heading}</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${why}</div>
      </div>
    </div>`;
}

/* ───────────────────────────────────────
   9.  COMMUNITY + NETWORK
─────────────────────────────────────── */
function buildCommunity(community, network) {
  const sec = document.getElementById('community-section');

  const commItems = community.items.map(item => `
    <div class="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div class="w-10 h-10 icon-bg-${item.color} rounded-xl flex items-center justify-center flex-shrink-0">
        <i class="fa-solid ${item.icon}"></i>
      </div>
      <div>
        <p class="font-semibold text-slate-800 text-sm">${item.title}</p>
        <p class="text-slate-500 text-xs mt-1">${item.desc}</p>
      </div>
    </div>`).join('');

  const netCards = network.cards.map(c => `
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
      <i class="fa-solid ${c.icon} text-${c.color}-500 text-2xl mb-3"></i>
      <p class="font-semibold text-slate-800 text-sm">${c.title}</p>
      <p class="text-slate-500 text-xs mt-1">${c.sub}</p>
    </div>`).join('');

  sec.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-2 gap-12 items-center">

        <!-- Community -->
        <div data-aos="fade-right">
          <span class="section-badge">${community.badge}</span>
          <h2 class="section-title text-3xl sm:text-4xl mt-2">${community.heading}</h2>
          <div class="section-underline"></div>
          <p class="text-slate-600 mt-6 leading-relaxed text-sm">${community.description}</p>
          <div class="mt-8 space-y-4">${commItems}</div>
        </div>

        <!-- Network -->
        <div data-aos="fade-left">
          <span class="section-badge">${network.badge}</span>
          <h2 class="section-title text-3xl sm:text-4xl mt-2">${network.heading}</h2>
          <div class="section-underline"></div>
          <p class="text-slate-600 mt-6 leading-relaxed text-sm">${network.description}</p>
          <div class="mt-8 grid grid-cols-2 gap-4">${netCards}</div>
        </div>
      </div>
    </div>`;
}

/* ───────────────────────────────────────
   10.  GALLERY
─────────────────────────────────────── */
function buildGallery(gallery) {
  const sec = document.getElementById('gallery-section');

  const items = gallery.images.map((img, i) => {
    const ph = gallery.placeholders[i] || { bg: '1e40af', label: 'Photo' };
    /* Use placeholder if the local image path looks like a placeholder path */
    const isLocalPath = img.thumb.startsWith('assets/');
    const thumbSrc    = isLocalPath ? placeholder(ph.bg, ph.label) : img.thumb;
    const fullSrc     = isLocalPath ? placeholder(ph.bg, ph.label) : img.full;
    return `
      <div class="gallery-item" data-aos="zoom-in" data-aos-delay="${(i % 4) * 60}">
        <a href="${fullSrc}" data-lightbox="gallery" data-title="${img.alt}">
          <img src="${thumbSrc}" alt="${img.alt}" loading="lazy" />
          <div class="gallery-overlay">
            <i class="fa-solid fa-magnifying-glass-plus text-white text-2xl"></i>
          </div>
        </a>
        <p class="gallery-caption">${img.caption}</p>
      </div>`;
  }).join('');

  sec.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14" data-aos="fade-up">
        <span class="section-badge">${gallery.badge}</span>
        <h2 class="section-title text-3xl sm:text-4xl mt-2">${gallery.heading}</h2>
        <div class="section-underline mx-auto"></div>
        <p class="text-slate-500 mt-5 max-w-xl mx-auto text-sm">${gallery.subtext}</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">${items}</div>
    </div>`;
}

/* ───────────────────────────────────────
   11.  PHILOSOPHY QUOTE
─────────────────────────────────────── */
function buildPhilosophy(ph) {
  const sec = document.getElementById('philosophy-section');
  sec.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative" data-aos="fade-up">
      <i class="fa-solid fa-quote-left text-white/20 text-6xl mb-6 block"></i>
      <blockquote class="section-title text-2xl sm:text-3xl text-white font-medium leading-relaxed mb-8">
        "${ph.quote}"
      </blockquote>
      <div class="flex items-center justify-center gap-3">
        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-user-doctor text-white text-lg"></i>
        </div>
        <div class="text-left">
          <p class="text-white font-semibold">${ph.author}</p>
          <p class="text-blue-200 text-sm">${ph.author_role}</p>
        </div>
      </div>
    </div>`;
}

/* ───────────────────────────────────────
   12.  CONTACT
─────────────────────────────────────── */
function buildContact(contact) {
  const sec = document.getElementById('contact-section');

  const infoItems = contact.info.map(item => `
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <i class="fa-solid ${item.icon} text-white"></i>
      </div>
      <div>
        <p class="text-blue-200 text-xs mb-1">${item.label}</p>
        <p class="font-medium text-sm">${item.value}</p>
      </div>
    </div>`).join('');

  /* Build form fields */
  const fields = contact.form.fields.map(f => {
    const req = f.required ? ' *' : '';
    if (f.type === 'textarea') {
      return `
        <div>
          <label class="form-label" for="${f.id}">${f.label}${req}</label>
          <textarea id="${f.id}" rows="4" placeholder="${f.placeholder}" class="form-input resize-none"></textarea>
        </div>`;
    }
    return `
      <div>
        <label class="form-label" for="${f.id}">${f.label}${req}</label>
        <input id="${f.id}" type="${f.type}" placeholder="${f.placeholder}" class="form-input" />
      </div>`;
  });

  /* Group first two side-by-side */
  const formBody = `
    <div class="grid sm:grid-cols-2 gap-4">
      ${fields[0]}${fields[1]}
    </div>
    ${fields.slice(2).join('')}`;

  sec.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-14" data-aos="fade-up">
        <span class="section-badge">${contact.badge}</span>
        <h2 class="section-title text-3xl sm:text-4xl mt-2">${contact.heading}</h2>
        <div class="section-underline mx-auto"></div>
        <p class="text-slate-500 mt-5 max-w-xl mx-auto text-sm">${contact.subtext}</p>
      </div>

      <div class="grid lg:grid-cols-5 gap-8">

        <!-- Info -->
        <div class="lg:col-span-2 space-y-5" data-aos="fade-right">
          <div class="contact-info-card">
            <h3 class="font-semibold text-lg mb-5">Contact Information</h3>
            <div class="space-y-4">${infoItems}</div>
          </div>
        </div>

        <!-- Form -->
        <div class="lg:col-span-3" data-aos="fade-left">
          <div class="bg-slate-50 rounded-2xl p-8 border border-slate-100 shadow-sm">
            <h3 class="font-semibold text-slate-800 text-lg mb-6">${contact.form.heading}</h3>
            <div class="space-y-4">
              ${formBody}
              <button id="submit-btn"
                class="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm">
                <i class="fa-solid ${contact.form.submit_icon} mr-2"></i>${contact.form.submit_label}
              </button>
              <p class="text-center text-xs text-slate-400">${contact.form.privacy_note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  /* Attach submit handler */
  document.getElementById('submit-btn').addEventListener('click', () => {
    showToast(contact.form.success_message);
  });
}

/* ───────────────────────────────────────
   13.  FOOTER
─────────────────────────────────────── */
function buildFooter(footer) {
  const sec = document.getElementById('footer-section');

  const social = footer.social.map(s => `
    <a href="${s.href}" aria-label="${s.label}" class="footer-social-btn">
      <i class="${s.icon} text-sm"></i>
    </a>`).join('');

  const qLinks = footer.quick_links.map(l => `
    <li><a href="${l.href}" class="text-slate-400 hover:text-white text-sm transition">${l.label}</a></li>`).join('');

  const cInfo = footer.contact_info.map(c => `
    <li class="flex items-start gap-2.5 text-slate-400 text-sm">
      <i class="fa-solid ${c.icon} text-blue-400 mt-0.5 text-xs flex-shrink-0"></i>${c.text}
    </li>`).join('');

  sec.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        <!-- Brand -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <i class="fa-solid fa-heart-pulse text-white text-base"></i>
            </div>
            <div>
              <p class="font-bold text-base">${footer.brand.name}</p>
              <p class="text-blue-300 text-xs">${footer.brand.credentials}</p>
            </div>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed mb-5 max-w-sm">${footer.brand.description}</p>
          <div class="flex gap-3">${social}</div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-sm mb-4 text-blue-200 uppercase tracking-wider">${footer.quick_links_heading}</h4>
          <ul class="space-y-2.5">${qLinks}</ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-semibold text-sm mb-4 text-blue-200 uppercase tracking-wider">${footer.contact_heading}</h4>
          <ul class="space-y-3">${cInfo}</ul>
          <a href="${footer.cta.href}" class="inline-block mt-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg transition">${footer.cta.label}</a>
        </div>
      </div>

      <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-slate-500 text-xs">${footer.copyright}</p>
        <p class="text-slate-600 text-xs">${footer.tagline}</p>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════
   BEHAVIOUR FUNCTIONS
═══════════════════════════════════════ */

/* Navbar scroll effect */
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* Hamburger toggle */
function setupMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => menu.classList.toggle('open'));
  document.querySelectorAll('.mobile-nav').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}

/* Smooth scroll for all internal links */
function setupSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
  });
}

/* Scroll-to-top button */
function setupScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* Animated counters triggered on hero entering viewport */
function setupCounters(stats) {
  let started = false;
  const hero  = document.getElementById('hero-section');
  const obs   = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    stats.forEach(s => {
      const el = document.getElementById(s.id);
      if (!el) return;
      let val = 0;
      const step     = Math.ceil(s.target / 112);   // ~1.8 s at 16 ms ticks
      const interval = setInterval(() => {
        val += step;
        if (val >= s.target) { val = s.target; clearInterval(interval); }
        el.textContent = val + s.suffix;
      }, 16);
    });
  }, { threshold: 0.3 });
  obs.observe(hero);
}

/* Toast notification */
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-check-circle mr-2"></i>${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

/* ── Kick everything off once DOM is ready ── */
document.addEventListener('DOMContentLoaded', init);


const data = {
  "site": {
    "title": "Dr. Lokeswara Rao Pelluru | Cardiothoracic & Vascular Surgeon",
    "favicon": "assets/images/favicon.png"
  },

  "navbar": {
    "logo": {
      "name": "Dr. L.R. Pelluru",
      "subtitle": "CTVS Surgeon"
    },
    "links": [
      { "label": "About",        "href": "#about" },
      { "label": "Expertise",    "href": "#expertise" },
      { "label": "Experience",   "href": "#experience" },
      { "label": "Achievements", "href": "#achievements" },
      { "label": "Procedures",   "href": "#procedures" },
      { "label": "Gallery",      "href": "#gallery" }
    ],
    "cta": { "label": "Book Appointment", "href": "#contact" }
  },

  "hero": {
    "badge": "Available for Consultations",
    "name": "Dr. Lokeswara\nRao Pelluru",
    "highlight": "Rao Pelluru",
    "role": "Consultant Cardiothoracic & Vascular Surgeon",
    "meta": "MBBS, DNB (CTVS) · 12+ Years Experience · KIMS Hospital, Nellore",
    "checklist": [
      "Advanced Cardiac & Thoracic Care",
      "Minimally Invasive Expertise",
      "Trusted by Hundreds of Patients"
    ],
    "buttons": [
      { "label": "Book Consultation", "href": "#contact", "icon": "fa-calendar-check", "style": "primary" },
      { "label": "Learn More",        "href": "#about",   "icon": "fa-arrow-down",     "style": "outline" }
    ],
    "stats": [
      { "id": "stat-cabg",     "target": 200, "suffix": "+", "label": "CABG Surgeries" },
      { "id": "stat-vascular", "target": 100, "suffix": "+", "label": "Vascular Ops"   },
      { "id": "stat-years",    "target": 12,  "suffix": "+", "label": "Years Active"   }
    ],
    "hospital_badge": "KIMS Hospital",
    "experience_badge": { "value": "12+", "label": "Years" }
  },

  "about": {
    "badge": "About the Doctor",
    "heading": "Committed to\nAdvanced Cardiac Care",
    "paragraphs": [
      "Dr. Lokeswara Rao Pelluru is a highly skilled Cardiothoracic and Vascular Surgeon with over <strong class='text-blue-700'>12 years of experience</strong> in performing complex heart, lung, and vascular procedures. Currently serving as a Consultant CTVS Surgeon at <strong class='text-blue-700'>KIMS Hospital, Nellore</strong>.",
      "He has previously worked with reputed institutions including Medicover Hospital, Nellore, and Apollo Hospital, Chennai. Dr. Pelluru combines advanced surgical techniques with a strong focus on patient safety, faster recovery, and long-term health outcomes."
    ],
    "image": "assets/images/about-doctor.jpg",
    "image_alt": "Dr. Lokeswara Rao Pelluru – Cardiothoracic Surgeon",
    "qualifications": [
      {
        "icon": "fa-graduation-cap",
        "color": "blue",
        "degree": "MBBS",
        "institution": "Dr. NTR University of Health Sciences (2012)"
      },
      {
        "icon": "fa-certificate",
        "color": "cyan",
        "degree": "DNB – Cardiothoracic & Vascular Surgery",
        "institution": "National Board of Examinations, India"
      },
      {
        "icon": "fa-id-card",
        "color": "emerald",
        "degree": "AP Medical Council Registration",
        "institution": "Reg. No: 75048"
      }
    ],
    "floating_badges": [
      { "icon": "fa-medal",    "bg": "blue",    "title": "DNB Certified",  "sub": "CTVS Surgery"  },
      { "icon": "fa-hospital", "bg": "cyan",    "title": "KIMS Hospital",  "sub": "Nellore, AP"    }
    ]
  },

  "expertise": {
    "badge": "Areas of Expertise",
    "heading": "Specialized Surgical Expertise",
    "subtext": "Delivering precision in the most complex cardiac, thoracic, and vascular procedures.",
    "cards": [
      { "icon": "fa-heart-circle-plus", "color": "red",     "title": "Coronary Artery Bypass",    "desc": "Off-Pump CABG surgeries with 200+ successful outcomes and minimal complications." },
      { "icon": "fa-minimize",          "color": "blue",    "title": "Minimally Invasive Surgery", "desc": "Advanced minimally invasive cardiac and valve surgeries with faster recovery times." },
      { "icon": "fa-lungs",             "color": "cyan",    "title": "Thoracic Surgeries",         "desc": "Lobectomy, Decortication, Lung Trauma, VATS, and Thymectomy procedures." },
      { "icon": "fa-droplet",           "color": "purple",  "title": "Vascular Surgeries",         "desc": "Bypass, Thrombectomy, A-V Fistulas, and Varicose Vein procedures with 100+ cases." },
      { "icon": "fa-heart",             "color": "emerald", "title": "Valve Repair & Replacement", "desc": "Aortic and Pulmonary valve repair and replacement surgeries with excellent outcomes." },
      { "icon": "fa-child-reaching",    "color": "orange",  "title": "Adult Congenital Heart",     "desc": "ASD, VSD, PDA closures and complex adult congenital heart condition surgeries." },
      { "icon": "fa-video",             "color": "teal",    "title": "VATS",                       "desc": "Video-Assisted Thoracoscopic Surgery for precision thoracic procedures." },
      { "icon": "fa-circle-nodes",      "color": "pink",    "title": "Cardiac Tumor Surgery",      "desc": "Expert surgical management of cardiac tumors requiring complex resection techniques." },
      { "icon": "fa-bolt",              "color": "yellow",  "title": "Chest Trauma",               "desc": "Emergency and elective management of complex chest trauma and injuries." }
    ]
  },

  "experience": {
    "badge": "Career Journey",
    "heading": "Professional Experience",
    "timeline": [
      {
        "role": "Consultant CTVS Surgeon",
        "hospital": "KIMS Hospital, Nellore",
        "period": "2024 – Present",
        "color": "blue",
        "desc": "Currently leading the CTVS department, performing complex cardiac, thoracic, and vascular surgeries with exceptional outcomes.",
        "tags": ["Cardiac Surgery", "CABG", "Valve Surgery"]
      },
      {
        "role": "Consultant CTVS Surgeon",
        "hospital": "Medicover Hospital, Nellore",
        "period": "2020 – 2023",
        "color": "cyan",
        "desc": "Managed a wide spectrum of cardiothoracic surgeries, built the CTVS program, and mentored surgical teams.",
        "tags": ["Thoracic Surgery", "Vascular"]
      },
      {
        "role": "Junior Consultant",
        "hospital": "Apollo Hospital, Chennai",
        "period": "2018 – 2019",
        "color": "slate",
        "desc": "Trained under eminent surgeons at India's premier cardiac facility, gaining expertise in complex cardiac procedures.",
        "tags": ["Apollo Chennai", "Advanced Training"]
      }
    ]
  },

  "achievements": {
    "badge": "Key Achievements",
    "heading": "Milestones & Recognition",
    "stats": [
      { "icon": "fa-heart-pulse", "gradient": "from-cyan-400 to-blue-500",    "value": "200+", "label": "Off-Pump CABG Surgeries"         },
      { "icon": "fa-droplet",     "gradient": "from-emerald-400 to-teal-500",  "value": "100+", "label": "Vascular Surgeries & Procedures" },
      { "icon": "fa-flask",       "gradient": "from-purple-400 to-pink-500",   "value": "12+",  "label": "Years of Expertise"              },
      { "icon": "fa-trophy",      "gradient": "from-orange-400 to-red-500",    "value": "3+",   "label": "Premier Hospital Associations"   }
    ],
    "bullets": [
      "Extensive experience in minimally invasive cardiac techniques",
      "Actively involved in research and medical publications",
      "Participated in multiple national-level workshops",
      "Registered with Andhra Pradesh Medical Council (#75048)"
    ]
  },

  "procedures": {
    "badge": "Treatments",
    "heading": "Specialized Treatments & Procedures",
    "subtext": "A comprehensive range of cardiac, thoracic, and vascular interventions delivered with surgical precision.",
    "list": [
      "Coronary Angiogram & Angioplasty (PTCA)",
      "CABG (Coronary Artery Bypass)",
      "Valve Replacement & Repair",
      "Pacemaker Implantation",
      "Open Heart Surgery",
      "Aortic & Pulmonary Valve Replacement",
      "Biventricular Pacing",
      "Thrombectomy",
      "Video-Assisted Thoracoscopic Surgery (VATS)",
      "Off-Pump CABG",
      "Lobectomy & Decortication",
      "A-V Fistula Creation",
      "Varicose Vein Surgery",
      "ASD / VSD / PDA Closure",
      "Cardiac Tumor Resection",
      "Thymectomy"
    ],
    "why_choose": {
      "heading": "Why Choose Dr. Pelluru?",
      "points": [
        { "icon": "fa-star",                "color": "blue",    "text": "12+ years of specialized surgical experience"        },
        { "icon": "fa-minimize",            "color": "cyan",    "text": "Expertise in minimally invasive procedures"          },
        { "icon": "fa-shield-heart",        "color": "emerald", "text": "Proven success in complex cardiac surgeries"         },
        { "icon": "fa-hand-holding-heart",  "color": "purple",  "text": "Patient-first approach with personalized care"       },
        { "icon": "fa-hospital",            "color": "orange",  "text": "Association with leading premium hospitals"          },
        { "icon": "fa-microscope",          "color": "rose",    "text": "Actively involved in research & publications"        }
      ]
    }
  },

  "community": {
    "badge": "Community",
    "heading": "Medical Camps & Community Initiatives",
    "description": "Dr. Pelluru actively participates in community healthcare initiatives aimed at improving access to quality medical care beyond hospital walls.",
    "items": [
      { "icon": "fa-tent-medical", "color": "red",     "title": "Free Cardiac Health Camps",        "desc": "Conducted free cardiac and general health check-up camps for underserved communities." },
      { "icon": "fa-bullhorn",     "color": "blue",    "title": "Heart Health Awareness Programs",   "desc": "Organized awareness programs on heart health, lifestyle diseases, and preventive care." },
      { "icon": "fa-people-group", "color": "emerald", "title": "Rural & Underserved Communities",   "desc": "Collaborated with healthcare teams to support rural communities and promote early screening." }
    ]
  },

  "network": {
    "badge": "Network",
    "heading": "Professional Network & Collaborations",
    "description": "Dr. Pelluru maintains strong connections with leading specialists across India, ensuring the best possible coordinated care for every patient.",
    "cards": [
      { "icon": "fa-user-group",    "color": "blue",    "title": "Multidisciplinary Teams", "sub": "Complex surgical case collaboration" },
      { "icon": "fa-comments",      "color": "cyan",    "title": "Knowledge Sharing",        "sub": "Medical conferences & forums"       },
      { "icon": "fa-network-wired", "color": "purple",  "title": "Specialist Network",       "sub": "Cardiologists, anesthesiologists"   },
      { "icon": "fa-book-medical",  "color": "emerald", "title": "Research & Publications",  "sub": "Active in medical research"         }
    ]
  },

  "gallery": {
    "badge": "Gallery",
    "heading": "Professional Journey",
    "subtext": "A glimpse into Dr. Pelluru's clinical practice, community outreach, and professional milestones.",
    "images": [
      { "thumb": "assets/images/gallery/gallery-1.jpg", "full": "assets/images/gallery/gallery-1.jpg", "alt": "Medical camp outreach",        "caption": "Medical Camp"     },
      { "thumb": "assets/images/gallery/gallery-2.jpg", "full": "assets/images/gallery/gallery-2.jpg", "alt": "Surgical clinical practice",   "caption": "Surgical Practice"},
      { "thumb": "assets/images/gallery/gallery-3.jpg", "full": "assets/images/gallery/gallery-3.jpg", "alt": "Medical conference",           "caption": "Conference"       },
      { "thumb": "assets/images/gallery/gallery-4.jpg", "full": "assets/images/gallery/gallery-4.jpg", "alt": "Award ceremony",               "caption": "Award Ceremony"   },
      { "thumb": "assets/images/gallery/gallery-5.jpg", "full": "assets/images/gallery/gallery-5.jpg", "alt": "National workshop",            "caption": "Workshop"         },
      { "thumb": "assets/images/gallery/gallery-6.jpg", "full": "assets/images/gallery/gallery-6.jpg", "alt": "Health awareness drive",       "caption": "Awareness Drive"  },
      { "thumb": "assets/images/gallery/gallery-7.jpg", "full": "assets/images/gallery/gallery-7.jpg", "alt": "KIMS Hospital Nellore",        "caption": "KIMS Hospital"    },
      { "thumb": "assets/images/gallery/gallery-8.jpg", "full": "assets/images/gallery/gallery-8.jpg", "alt": "Certifications and training",  "caption": "Certifications"   }
    ],
    "placeholders": [
      { "bg": "1e40af", "label": "Medical+Camp"     },
      { "bg": "0e7490", "label": "Surgery+Practice" },
      { "bg": "1d4ed8", "label": "Conference"       },
      { "bg": "0369a1", "label": "Award+Ceremony"   },
      { "bg": "155e75", "label": "Workshop"         },
      { "bg": "1e3a5f", "label": "Awareness+Drive"  },
      { "bg": "134e4a", "label": "KIMS+Hospital"    },
      { "bg": "312e81", "label": "Certifications"   }
    ]
  },

  "philosophy": {
    "quote": "My goal is to ensure accurate diagnosis, effective treatment, and improved quality of life for every patient — combining advanced surgical expertise with empathy and clear communication.",
    "author": "Dr. Lokeswara Rao Pelluru",
    "author_role": "Consultant CTVS Surgeon"
  },

  "contact": {
    "badge": "Get in Touch",
    "heading": "Book a Consultation",
    "subtext": "Take the first step towards better heart health. Schedule your consultation with Dr. Pelluru today.",
    "info": [
      { "icon": "fa-location-dot", "label": "Location", "value": "Nellore, Andhra Pradesh, India" },
      { "icon": "fa-hospital",     "label": "Hospital",  "value": "KIMS Hospital, Nellore"        },
      { "icon": "fa-phone",        "label": "Phone",     "value": "+91 [Contact Number]"          },
      { "icon": "fa-envelope",     "label": "Email",     "value": "[Email Address]"               },
      { "icon": "fa-id-card",      "label": "Medical Registration", "value": "AP Medical Council – Reg. No: 75048" }
    ],
    "form": {
      "heading": "Request an Appointment",
      "fields": [
        { "id": "fname",    "label": "Full Name",                    "type": "text",     "placeholder": "Your full name",        "required": true  },
        { "id": "phone",    "label": "Phone Number",                 "type": "tel",      "placeholder": "+91 XXXXX XXXXX",       "required": true  },
        { "id": "email",    "label": "Email Address",                "type": "email",    "placeholder": "your@email.com",        "required": false },
        { "id": "date",     "label": "Preferred Date",               "type": "date",     "placeholder": "",                      "required": false },
        { "id": "concern",  "label": "Brief Description of Concern", "type": "textarea", "placeholder": "Describe your symptoms or reason for consultation...", "required": false }
      ],
      "submit_label": "Request Appointment",
      "submit_icon": "fa-calendar-check",
      "privacy_note": "Your information is kept confidential and secure.",
      "success_message": "Thank you! Your appointment request has been submitted. Dr. Pelluru's team will contact you shortly."
    }
  },

  "footer": {
    "brand": {
      "name": "Dr. Lokeswara Rao Pelluru",
      "credentials": "MBBS, DNB (CTVS)",
      "description": "Consultant Cardiothoracic and Vascular Surgeon delivering advanced heart, lung, and vascular care with precision and compassion."
    },
    "social": [
      { "icon": "fab fa-linkedin-in", "href": "#", "label": "LinkedIn" },
      { "icon": "fab fa-twitter",     "href": "#", "label": "Twitter"  },
      { "icon": "fab fa-whatsapp",    "href": "#", "label": "WhatsApp" }
    ],
    "quick_links_heading": "Quick Links",
    "quick_links": [
      { "label": "About",        "href": "#about"        },
      { "label": "Expertise",    "href": "#expertise"    },
      { "label": "Experience",   "href": "#experience"   },
      { "label": "Achievements", "href": "#achievements" },
      { "label": "Procedures",   "href": "#procedures"   },
      { "label": "Gallery",      "href": "#gallery"      }
    ],
    "contact_heading": "Contact",
    "contact_info": [
      { "icon": "fa-location-dot", "text": "Nellore, Andhra Pradesh, India" },
      { "icon": "fa-hospital",     "text": "KIMS Hospital, Nellore"         },
      { "icon": "fa-id-card",      "text": "AP Medical Council: 75048"      }
    ],
    "cta": { "label": "Book Appointment", "href": "#contact" },
    "copyright": "© 2025 Dr. Lokeswara Rao Pelluru. All rights reserved.",
    "tagline": "Consultant CTVS Surgeon | KIMS Hospital, Nellore"
  }
}


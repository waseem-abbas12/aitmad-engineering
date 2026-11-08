/**
 * Aitmaad Engineering - Live CMS Frontend Dynamic Synchronizer
 * Automatically hydrates public website pages with live content from CMS database.
 * Enables zero-hardcoding: Any update made in /admin immediately syncs on the frontend!
 */

(function () {
  'use strict';

  const CMS_API_ENDPOINT = '/api/content';
  const CMS_CACHE_KEY = 'aitmaad_cms_live_cache';

  async function fetchCMSData() {
    try {
      const res = await fetch(CMS_API_ENDPOINT);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem(CMS_CACHE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      // offline / file protocol / serverless cold start fallback
    }

    // Try cached version
    const cached = localStorage.getItem(CMS_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (err) {}
    }
    return null;
  }

  function applyCMSData(data) {
    if (!data) return;

    // 1. Branding (Logo, Favicon, Topbar)
    const branding = data.branding || {};
    if (branding.logo) {
      document.querySelectorAll('.header-logo img, .auth-logo, .site-logo img').forEach(img => {
        img.src = branding.logo.startsWith('/') || branding.logo.startsWith('http') ? branding.logo : '/' + branding.logo;
      });
    }

    if (branding.topbarAnnouncement) {
      document.querySelectorAll('[data-cms="topbar"], .topbar-text, .announcement-bar').forEach(el => {
        el.textContent = branding.topbarAnnouncement;
      });
    }

    if (branding.headerCtaText) {
      document.querySelectorAll('.nav-cta-btn, .header-cta').forEach(btn => {
        const span = btn.querySelector('span') || btn;
        span.textContent = branding.headerCtaText;
        if (branding.headerCtaLink && btn.tagName === 'A') {
          btn.href = branding.headerCtaLink;
        }
      });
    }

    // 2. Navigation Menu Links
    if (Array.isArray(data.navigation) && data.navigation.length > 0) {
      const navContainer = document.querySelector('.nav-menu, .nav-links');
      if (navContainer && navContainer.dataset.cmsDynamic === 'true') {
        navContainer.innerHTML = data.navigation.map(item => `
          <a href="${item.url}" class="nav-link" target="${item.target || '_self'}">${item.label}</a>
        `).join('');
      }
    }

    // 3. Site Contact Info & Settings
    const s = data.siteSettings || {};
    if (s.phone) {
      document.querySelectorAll('[data-cms="phone"]').forEach(el => el.textContent = s.phone);
      document.querySelectorAll('a[href^="tel:"]').forEach(a => a.href = 'tel:' + s.phone.replace(/[^0-9+]/g, ''));
    }
    if (s.whatsapp) {
      document.querySelectorAll('a[href*="wa.me"]').forEach(a => a.href = 'https://wa.me/' + s.whatsapp.replace(/[^0-9]/g, ''));
    }
    if (s.email) {
      document.querySelectorAll('[data-cms="email"]').forEach(el => el.textContent = s.email);
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.href = 'mailto:' + s.email);
    }
    if (s.address) {
      document.querySelectorAll('[data-cms="address"]').forEach(el => el.textContent = s.address);
    }

    // 4. Hero Content
    const hero = data.heroContent || {};
    if (hero.liveBadge) {
      document.querySelectorAll('.badge-pulse-text, [data-cms="hero-badge"]').forEach(el => el.textContent = hero.liveBadge);
    }
    if (hero.eyebrow) {
      const el = document.querySelector('.hero-eyebrow, [data-cms="hero-eyebrow"]');
      if (el) el.textContent = hero.eyebrow;
    }
    if (hero.titleLead && hero.titleAccent) {
      const titleEl = document.querySelector('.hero-title, [data-cms="hero-title"]');
      if (titleEl) {
        titleEl.innerHTML = `${hero.titleLead} <span class="text-accent">${hero.titleAccent}</span>`;
      }
    }
    if (hero.sub) {
      const subEl = document.querySelector('.hero-desc, [data-cms="hero-sub"]');
      if (subEl) subEl.textContent = hero.sub;
    }
    if (hero.primaryBtnText) {
      const btn1 = document.querySelector('.hero-actions .btn-primary, [data-cms="hero-btn1"]');
      if (btn1) {
        const sp = btn1.querySelector('span') || btn1;
        sp.textContent = hero.primaryBtnText;
        if (hero.primaryBtnLink && btn1.tagName === 'A') btn1.href = hero.primaryBtnLink;
      }
    }

    // 5. Hero Stats Counters (10+, 100+, 40+, 1M+)
    const m = data.metrics || {};
    if (m.clients) {
      const clientsVal = m.clients.replace(/[^0-9.]/g, '');
      document.querySelectorAll('.ribbon-item:nth-child(5) .counter-val, [data-cms="stat-clients"]').forEach(el => {
        el.setAttribute('data-target', clientsVal);
        el.textContent = clientsVal;
      });
    }
    if (m.areaBuilt) {
      const areaVal = m.areaBuilt.replace(/[^0-9.]/g, '');
      document.querySelectorAll('.ribbon-item:nth-child(7) .counter-val, [data-cms="stat-area"]').forEach(el => {
        el.setAttribute('data-target', areaVal);
        el.textContent = areaVal;
      });
    }

    // 6. Spotlight Banner
    const sp = data.spotlight || {};
    const spotlightSec = document.querySelector('.spotlight-section');
    if (spotlightSec && sp.title) {
      if (sp.bgImage) {
        spotlightSec.style.backgroundImage = `url('${sp.bgImage}')`;
      }
      const titleEl = spotlightSec.querySelector('h2');
      if (titleEl && sp.title) titleEl.textContent = sp.title;

      const descEl = spotlightSec.querySelector('p');
      if (descEl && sp.desc) descEl.textContent = sp.desc;

      if (sp.clearSpanVal) {
        const spanNum = spotlightSec.querySelector('.spotlight-fact-item:nth-child(1) .counter-val');
        if (spanNum) {
          spanNum.setAttribute('data-target', sp.clearSpanVal);
          spanNum.textContent = sp.clearSpanVal;
        }
      }
      if (sp.weightVal) {
        const weightNum = spotlightSec.querySelector('.spotlight-fact-item:nth-child(2) .counter-val');
        if (weightNum) {
          weightNum.setAttribute('data-target', sp.weightVal);
          weightNum.textContent = sp.weightVal;
        }
      }
      if (sp.areaVal) {
        const areaNum = spotlightSec.querySelector('.spotlight-fact-item:nth-child(3) .counter-val');
        if (areaNum) {
          areaNum.setAttribute('data-target', sp.areaVal);
          areaNum.textContent = sp.areaVal;
        }
      }
      const ctaBtn = spotlightSec.querySelector('.btn-primary');
      if (ctaBtn) {
        if (sp.ctaText) {
          const spSpan = ctaBtn.querySelector('span') || ctaBtn;
          spSpan.textContent = sp.ctaText;
        }
        if (sp.ctaLink && ctaBtn.tagName === 'A') {
          ctaBtn.href = sp.ctaLink;
        }
      }
    }

    // 7. Footer & Socials
    const ft = data.footer || {};
    if (ft.copyrightNotice) {
      document.querySelectorAll('.footer-bottom-copy, [data-cms="copyright"]').forEach(el => {
        el.textContent = ft.copyrightNotice;
      });
    }

    const soc = data.socialLinks || {};
    if (soc.facebook) {
      document.querySelectorAll('a[href*="facebook.com"]').forEach(a => a.href = soc.facebook);
    }
    if (soc.linkedin) {
      document.querySelectorAll('a[href*="linkedin.com"]').forEach(a => a.href = soc.linkedin);
    }
    if (soc.instagram) {
      document.querySelectorAll('a[href*="instagram.com"]').forEach(a => a.href = soc.instagram);
    }
    if (soc.youtube) {
      document.querySelectorAll('a[href*="youtube.com"]').forEach(a => a.href = soc.youtube);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      const data = await fetchCMSData();
      applyCMSData(data);
    });
  } else {
    fetchCMSData().then(applyCMSData);
  }
})();

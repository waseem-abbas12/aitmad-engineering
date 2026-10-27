/**
 * Aitmad Engineering - Main JavaScript Orchestration
 * Spec: Sections 5, 6, 8, 12
 */

import { i18n } from './i18n.js';
import { Hero3DScene } from './hero3d.js';
import { ProjectsManager } from './projects.js';
import { QuoteFormHandler } from './forms.js';
import { testimonials } from '../data/testimonials.js';

class AitmadApp {
  constructor() {
    this.initPreloader();
    this.initHeader();
    this.initMobileMenu();
    this.initScrollProgress();
    this.initBackToTop();
    this.initCustomCursor();
    this.initCookieNotice();
    this.initCounters();
    this.initTestimonialSlider();
    this.initAccordions();
    this.initCardTilt();
    this.initModules();
  }

  // Preloader (Spec 5.5: Max 1.4s, once per session)
  initPreloader() {
    const preloader = document.getElementById('site-preloader');
    if (!preloader) return;

    const hasSeen = sessionStorage.getItem('aitmad_preloader_seen');
    if (hasSeen) {
      preloader.style.display = 'none';
      return;
    }

    setTimeout(() => {
      preloader.classList.add('fade-out');
      sessionStorage.setItem('aitmad_preloader_seen', 'true');
      setTimeout(() => {
        preloader.remove();
      }, 600);
    }, 1200);
  }

  // Header Scroll Transformation (Spec 5.1)
  initHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Language Toggle Click Handlers
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        i18n.toggleLanguage();
      });
    });
  }

  // Mobile Menu (Spec 5.2)
  initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggleBtn || !menu) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = menu.classList.contains('active');
      if (isOpen) {
        menu.classList.remove('active');
        toggleBtn.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        menu.classList.add('active');
        toggleBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggleBtn.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll Progress Bar (Spec 5.5)
  initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;
      }
    }, { passive: true });
  }

  // Back to Top (Spec 5.5: after 600px)
  initBackToTop() {
    const btn = document.getElementById('back-to-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Custom Cursor for Desktop (Spec 5.5)
  initCustomCursor() {
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const loop = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    // Hover effect on links and buttons
    const interactive = 'a, button, input, select, textarea, .filter-chip, .project-card, .service-card';
    document.querySelectorAll(interactive).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  // Cookie Notice (Spec 5.5)
  initCookieNotice() {
    const banner = document.getElementById('cookie-notice');
    if (!banner) return;

    const accepted = localStorage.getItem('aitmad_cookie_consent');
    if (!accepted) {
      setTimeout(() => {
        banner.classList.add('visible');
      }, 1500);
    }

    const acceptBtn = document.getElementById('cookie-accept-btn');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('aitmad_cookie_consent', 'true');
        banner.classList.remove('visible');
      });
    }
  }

  // Animated Stats Counters (Spec 6.4: 1.8s ease-out)
  initCounters() {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const numEl = entry.target.querySelector('[data-target]');
          if (numEl && !numEl.classList.contains('counted')) {
            numEl.classList.add('counted');
            this.runCounter(numEl);
          }
        }
      });
    }, { threshold: 0.3 });

    statCards.forEach(c => observer.observe(c));
  }

  runCounter(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = isDecimal ? (target * ease).toFixed(1) : Math.floor(target * ease);
      el.innerText = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = target;
      }
    };

    requestAnimationFrame(update);
  }

  // Testimonials Slider (Spec 6.10: 7s autoplay, pause on hover)
  initTestimonialSlider() {
    const sliderContainer = document.getElementById('testimonial-slider-container');
    if (!sliderContainer) return;

    sliderContainer.innerHTML = '';
    testimonials.forEach((t, i) => {
      const slide = document.createElement('div');
      slide.className = `testimonial-slide ${i === 0 ? 'active' : ''}`;
      slide.innerHTML = `
        <p class="testimonial-text">"${t.quote}"</p>
        <h4 class="testimonial-author">${t.author}</h4>
        <div class="testimonial-org">${t.designation}, ${t.company} (${t.location})</div>
      `;
      sliderContainer.appendChild(slide);
    });

    const slides = sliderContainer.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('testimonial-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `testimonial-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    let currentIndex = 0;
    let timer = null;

    const goToSlide = (index) => {
      slides[currentIndex].classList.remove('active');
      if (dotsContainer) dotsContainer.children[currentIndex].classList.remove('active');

      currentIndex = (index + slides.length) % slides.length;

      slides[currentIndex].classList.add('active');
      if (dotsContainer) dotsContainer.children[currentIndex].classList.add('active');
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    const startAuto = () => {
      timer = setInterval(nextSlide, 7000);
    };

    const stopAuto = () => {
      clearInterval(timer);
    };

    sliderContainer.parentElement.addEventListener('mouseenter', stopAuto);
    sliderContainer.parentElement.addEventListener('mouseleave', startAuto);
    startAuto();
  }

  // Accordion Expand/Collapse (Spec 7.2)
  initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        // Close siblings
        const parent = item.parentElement;
        parent.querySelectorAll('.accordion-item').forEach(sibling => {
          sibling.classList.remove('active');
          const body = sibling.querySelector('.accordion-body');
          if (body) body.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          const body = item.querySelector('.accordion-body');
          if (body) body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  // Card 3D Tilt on Desktop (Spec 6.5, 8: max 4 degrees)
  initCardTilt() {
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const tiltX = -(y / (rect.height / 2)) * 4;
        const tiltY = (x / (rect.width / 2)) * 4;

        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  initModules() {
    // 3D Hero Scene
    if (document.getElementById('hero-3d-canvas')) {
      new Hero3DScene('hero-3d-canvas');
    }

    // Projects Grid / Lightbox
    new ProjectsManager();

    // Quote Form Handler
    new QuoteFormHandler('quote-request-form');
    new QuoteFormHandler('contact-quote-form');
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.__AitmadApp = new AitmadApp();
});

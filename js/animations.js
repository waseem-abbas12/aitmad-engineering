/**
 * Aitmad Engineering - GSAP & ScrollTrigger Animation Engine
 * Best-in-class performance, physics-based easing, and magnetic micro-interactions
 */

export class AnimationEngine {
  constructor() {
    this.hasGSAP = typeof window.gsap !== 'undefined';
    this.hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.hasGSAP) {
      if (this.hasScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
      }
      this.init();
    }
  }

  init() {
    if (this.reducedMotion) return;

    this.initHeroCinematic();
    this.initScrollReveals();
    this.initGSAPCounters();
    this.initMagneticCardTilt();
    this.initParallaxScrub();
  }

  // 1. Hero Cinematic Entrance Timeline
  initHeroCinematic() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const tl = window.gsap.timeline({ delay: 0.2 });

    const badge = heroContent.querySelector('.hero-badge-wrap');
    const eyebrow = heroContent.querySelector('.eyebrow');
    const title = heroContent.querySelector('.hero-title');
    const subtitle = heroContent.querySelector('.hero-subtitle');
    const btnGroup = heroContent.querySelector('.hero-btn-group');
    const trustChips = heroContent.querySelector('.hero-trust-chips');
    const glassBar = document.querySelector('.hero-glass-bar');

    const elements = [badge, eyebrow, title, subtitle, btnGroup, trustChips].filter(Boolean);

    window.gsap.set(elements, { autoAlpha: 0, y: 28 });
    if (glassBar) window.gsap.set(glassBar, { autoAlpha: 0, y: 20 });

    tl.to(elements, {
      autoAlpha: 1,
      y: 0,
      duration: 0.95,
      stagger: 0.14,
      ease: 'power3.out'
    });

    if (glassBar) {
      tl.to(glassBar, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.4');
    }
  }

  // 2. ScrollTrigger Batch Revelations
  initScrollReveals() {
    if (!this.hasScrollTrigger) return;

    // Batch cards
    const cardSelectors = '.bento-card, .showcase-card, .project-card, .service-card, .stat-card';
    const cards = document.querySelectorAll(cardSelectors);

    if (cards.length > 0) {
      window.gsap.set(cards, { autoAlpha: 0, y: 32, scale: 0.97 });

      window.ScrollTrigger.batch(cardSelectors, {
        interval: 0.08,
        batchMax: 4,
        onEnter: batch => {
          window.gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: 0.1,
            duration: 0.85,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        },
        start: 'top 90%',
        once: true
      });
    }

    // Section headings & narrative content
    document.querySelectorAll('.about-preview-grid, .why-aitmad-grid, .why-feature-row').forEach(sec => {
      window.gsap.fromTo(sec, 
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 86%',
            once: true
          }
        }
      );
    });
  }

  // 3. GSAP Physics-Based Numeric Counters
  initGSAPCounters() {
    const statCards = document.querySelectorAll('.stat-card [data-target]');
    if (statCards.length === 0) return;

    statCards.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const counter = { value: 0 };

      window.gsap.to(counter, {
        value: target,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        },
        onUpdate: () => {
          el.innerText = isDecimal ? counter.value.toFixed(1) : Math.floor(counter.value);
        },
        onComplete: () => {
          el.innerText = target;
        }
      });
    });
  }

  // 4. Ultra-Smooth 60fps Magnetic Tilt using GSAP quickTo
  initMagneticCardTilt() {
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) return;

    const tiltCards = document.querySelectorAll('.bento-card, .showcase-card, .project-card, .service-card, .review-card');
    tiltCards.forEach(card => {
      const setRotateX = window.gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });
      const setRotateY = window.gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });
      const setY = window.gsap.quickTo(card, 'y', { duration: 0.4, ease: 'power2.out' });

      window.gsap.set(card, { transformPerspective: 900 });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const tiltX = -(y / (rect.height / 2)) * 4.5;
        const tiltY = (x / (rect.width / 2)) * 4.5;

        setRotateX(tiltX);
        setRotateY(tiltY);
        setY(-6);
      });

      card.addEventListener('mouseleave', () => {
        setRotateX(0);
        setRotateY(0);
        setY(0);
      });
    });
  }

  // 5. Subtle Image Parallax on Scroll
  initParallaxScrub() {
    if (!this.hasScrollTrigger) return;

    const parallaxImages = document.querySelectorAll('.about-img-wrap img, .showcase-card-img');
    parallaxImages.forEach(img => {
      window.gsap.to(img, {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      });
    });
  }
}

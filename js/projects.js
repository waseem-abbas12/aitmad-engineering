/**
 * Aitmad Engineering - Projects Grid, Filter, Lightbox & Detail Renderer
 * Spec: Section 6.6, 7.3, 7.4, 11
 */

import { projects } from '../data/projects.js';

export function resolveAssetPath(path) {
  if (!path || path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) {
    return path;
  }
  const isPagesDir = window.location.pathname.includes('/pages/');
  return isPagesDir ? `../${path}` : path;
}

export class ProjectsManager {
  constructor() {
    this.projects = projects;
    this.currentFilter = 'All';
    this.lightboxIndex = 0;
    this.lightboxImages = [];
    this.init();
  }

  init() {
    this.initShowcaseSlider();
    this.initHomeGrid();
    this.initProjectsPage();
    this.initProjectDetailPage();
    this.initLightbox();
  }

  // Swipe-Style Draggable Project Showcase Slider
  initShowcaseSlider() {
    const track = document.getElementById('project-showcase-track');
    const prevBtn = document.getElementById('showcase-prev-btn');
    const nextBtn = document.getElementById('showcase-next-btn');
    if (!track) return;

    const isPagesDir = window.location.pathname.includes('/pages/');

    track.innerHTML = this.projects.map(p => {
      const detailHref = isPagesDir ? `project.html?slug=${p.slug}` : `pages/project.html?slug=${p.slug}`;
      const imgSrc = resolveAssetPath(p.cover);
      return `
        <a href="${detailHref}" class="showcase-card" aria-label="${p.title}">
          <div class="showcase-card-img-wrap">
            <img class="showcase-card-img" src="${imgSrc}" alt="${p.title}" loading="lazy">
          </div>
          <div class="showcase-card-body">
            <div class="showcase-card-chips">
              <span class="showcase-chip red">${p.category}</span>
              <span class="showcase-chip">${p.span}</span>
            </div>
            <h3 class="showcase-card-title">${p.title}</h3>
            <p class="showcase-card-desc">${p.overview.substring(0, 115)}...</p>
            <div class="showcase-card-footer">
              <span>📍 ${p.location}</span>
              <span style="color: var(--red-500); font-weight: 700;">Explore Specs →</span>
            </div>
          </div>
        </a>
      `;
    }).join('');

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const cardWidth = track.querySelector('.showcase-card')?.offsetWidth || 350;
        track.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const cardWidth = track.querySelector('.showcase-card')?.offsetWidth || 350;
        track.scrollBy({ left: cardWidth + 24, behavior: 'smooth' });
      });
    }

    // Grab & Drag functionality
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('active-drag');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('active-drag');
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('active-drag');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.6;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  // Home Page Featured Projects Grid (Spec 6.6)
  initHomeGrid() {
    const gridContainer = document.getElementById('featured-projects-grid');
    const filterContainer = document.getElementById('home-project-filters');
    if (!gridContainer) return;

    this.renderCards(gridContainer, 6, true);

    if (filterContainer) {
      filterContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;

        filterContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        this.currentFilter = chip.getAttribute('data-filter') || 'All';
        this.renderCards(gridContainer, 6, true);
      });
    }
  }

  // Full Projects Listing Page (Spec 7.3)
  initProjectsPage() {
    const fullGrid = document.getElementById('all-projects-grid');
    const filterBar = document.getElementById('projects-filter-bar');
    const searchInput = document.getElementById('project-search-input');
    if (!fullGrid) return;

    this.renderCards(fullGrid, 12, false);

    if (filterBar) {
      filterBar.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;

        filterBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        this.currentFilter = chip.getAttribute('data-filter') || 'All';
        this.filterAndSearchProjects(fullGrid, searchInput ? searchInput.value : '');
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterAndSearchProjects(fullGrid, e.target.value);
      });
    }
  }

  filterAndSearchProjects(container, query = '') {
    const q = query.toLowerCase().trim();
    let filtered = this.projects;

    if (this.currentFilter !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === this.currentFilter.toLowerCase());
    }

    if (q) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q)
      );
    }

    this.renderCustomList(container, filtered, false);
  }

  renderCards(container, limit = 6, editorialLayout = false) {
    let filtered = this.projects;
    if (this.currentFilter !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === this.currentFilter.toLowerCase());
    }
    const displayed = filtered.slice(0, limit);
    this.renderCustomList(container, displayed, editorialLayout);
  }

  renderCustomList(container, list, editorialLayout = false) {
    container.innerHTML = '';

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--steel);">
          <p style="font-size: 1.1rem; margin-bottom: 8px;">No projects found matching the criteria.</p>
          <span style="font-size: 0.85rem;">Try choosing another category or clearing your search.</span>
        </div>
      `;
      return;
    }

    list.forEach((p, index) => {
      const isLarge = editorialLayout && index === 0;
      const card = document.createElement('a');
      card.className = `project-card ${isLarge ? 'featured-span' : ''}`;
      // Fix relative path depending on current location
      const isPagesDir = window.location.pathname.includes('/pages/');
      const detailHref = isPagesDir ? `project.html?slug=${p.slug}` : `pages/project.html?slug=${p.slug}`;
      card.href = detailHref;

      card.innerHTML = `
        <img class="project-card-img" src="${resolveAssetPath(p.cover)}" alt="${p.title}" loading="lazy">
        <div class="project-card-overlay">
          <span class="project-card-badge">${p.category}</span>
          <h3 class="project-card-title">${p.title}</h3>
          <div class="project-card-meta">
            <span>${p.location}</span>
            <span>•</span>
            <span>${p.area}</span>
          </div>
        </div>
        <div class="project-card-hover-action" aria-label="View Project">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // Project Detail Page (Spec 7.4)
  initProjectDetailPage() {
    const detailRoot = document.getElementById('project-detail-root');
    if (!detailRoot) return;

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug') || this.projects[0].slug;
    const project = this.projects.find(p => p.slug === slug) || this.projects[0];

    // Find Prev / Next projects
    const currentIndex = this.projects.findIndex(p => p.slug === project.slug);
    const prevProject = this.projects[(currentIndex - 1 + this.projects.length) % this.projects.length];
    const nextProject = this.projects[(currentIndex + 1) % this.projects.length];

    // Update document title
    document.title = `${project.title} | Aitmad Engineering`;

    detailRoot.innerHTML = `
      <section class="page-banner bg-blueprint">
        <div class="container">
          <div class="breadcrumbs">
            <a href="../index.html">Home</a>
            <span>/</span>
            <a href="projects.html">Projects</a>
            <span>/</span>
            <span class="text-copper-300">${project.title}</span>
          </div>
          <span class="eyebrow">${project.category} Infrastructure</span>
          <h1 class="text-ivory" style="margin-bottom: 16px;">${project.title}</h1>
          <p class="text-steel-light" style="max-width: 650px; font-size: 1.1rem;">
            ${project.location} • Completed in ${project.year} • Handover in ${project.duration}
          </p>
        </div>
      </section>

      <section class="section bg-ivory">
        <div class="container">
          <div style="border-radius: var(--radius-card); overflow: hidden; margin-bottom: 48px; max-height: 540px; box-shadow: var(--shadow-card);">
            <img src="${project.cover}" alt="${project.title}" style="width: 100%; height: 500px; object-fit: cover;">
          </div>

          <div class="project-detail-layout">
            <!-- Left Sticky Fact Panel (Spec 7.4) -->
            <aside class="project-sticky-panel">
              <div class="fact-panel-card">
                <h3 style="font-size: 1.2rem; color: var(--pine-800); margin-bottom: 16px; border-bottom: 2px solid var(--copper-500); padding-bottom: 8px;">
                  Project Specifications
                </h3>
                <table class="fact-table">
                  <tbody>
                    <tr><th>Client</th><td>${project.client}</td></tr>
                    <tr><th>Location</th><td>${project.location}</td></tr>
                    <tr><th>Total Covered Area</th><td>${project.area}</td></tr>
                    <tr><th>Clear Span</th><td>${project.span}</td></tr>
                    <tr><th>Eave Height</th><td>${project.eaveHeight}</td></tr>
                    <tr><th>Year Completed</th><td>${project.year}</td></tr>
                    <tr><th>Execution Period</th><td>${project.duration}</td></tr>
                  </tbody>
                </table>

                <div style="margin-top: 24px;">
                  <span style="font-size: 0.85rem; font-weight: 600; color: var(--pine-800); display: block; margin-bottom: 8px;">Scope of Work:</span>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${project.scope.map(s => `<span class="project-card-badge" style="margin: 0;">${s}</span>`).join('')}
                  </div>
                </div>

                <div style="margin-top: 28px;">
                  <a href="contact.html" class="btn btn-primary" style="width: 100%;">
                    <span>Inquire About Similar Project</span>
                  </a>
                </div>
              </div>
            </aside>

            <!-- Right 4 Story Blocks (Spec 7.4) -->
            <div class="project-narrative">
              <div class="project-story-block">
                <h3>01. Overview</h3>
                <p>${project.overview}</p>
              </div>

              <div class="project-story-block">
                <h3>02. The Challenge</h3>
                <p>${project.challenge}</p>
              </div>

              <div class="project-story-block">
                <h3>03. The Engineering Solution</h3>
                <p>${project.solution}</p>
              </div>

              <div class="project-story-block">
                <h3>04. Quantifiable Results</h3>
                <p>${project.result}</p>
              </div>

              <!-- Gallery Masonry with Lightbox -->
              <div style="margin-top: 48px;">
                <h3 style="margin-bottom: 16px;">Project Visuals</h3>
                <div class="masonry-gallery" id="project-gallery-masonry">
                  ${project.gallery.map((imgUrl, i) => `
                    <div class="gallery-item" data-index="${i}" data-src="${resolveAssetPath(imgUrl)}">
                      <img src="${resolveAssetPath(imgUrl)}" alt="${project.title} detail photo" loading="lazy">
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Next / Prev Project Navigation (Spec 7.4) -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 64px; padding-top: 32px; border-top: 1px solid var(--stone);">
                <a href="project.html?slug=${prevProject.slug}" class="link-text">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  <span>Previous: ${prevProject.title}</span>
                </a>
                <a href="project.html?slug=${nextProject.slug}" class="link-text">
                  <span>Next: ${nextProject.title}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Bind Gallery clicks to Lightbox
    const galleryItems = detailRoot.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        this.openLightbox([src], 0);
      });
    });
  }

  // Lightbox System (Spec 7.3, 7.4)
  initLightbox() {
    let modal = document.querySelector('.lightbox-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'lightbox-modal';
      modal.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close Lightbox">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <img class="lightbox-img" src="" alt="Enlarged project view">
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.lightbox-close').addEventListener('click', () => {
        modal.classList.remove('active');
      });

      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }
      });
    }
    this.lightboxModal = modal;
  }

  openLightbox(images, index = 0) {
    if (!this.lightboxModal) return;
    const imgEl = this.lightboxModal.querySelector('.lightbox-img');
    imgEl.src = images[index];
    this.lightboxModal.classList.add('active');
  }
}

/**
 * Aitmaad Engineering - Admin CMS Interactive Controller
 * WordPress / Shopify-inspired responsive CMS manager
 */

window.AdminAppLoaded = true;

const API_BASE = '/api';
let authToken = localStorage.getItem('aitmaad_admin_token') || '';
let currentUser = null;
let currentTargetUploadInput = null;

// Application State
let appState = {
  projects: [],
  services: [],
  categories: [],
  navigation: [],
  testimonials: [],
  clients: [],
  inquiries: [],
  content: {},
  branding: {},
  spotlight: {},
  footer: {},
  socialLinks: {},
  media: []
};

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  bindNavigation();
  bindForms();
  bindMediaUpload();
});

// Toast Helper
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '⚠'}</span>
    <div>${message}</div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, 3500);
}

// 1. Authentication Manager
function initAuth() {
  const authScreen = document.getElementById('auth-screen');
  const appShell = document.getElementById('app-shell');

  if (!authToken) {
    authScreen.style.display = 'flex';
    appShell.style.display = 'none';
  } else {
    verifySession();
  }

  // Handle Login form
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.style.display = 'none';

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        authToken = data.token;
        localStorage.setItem('aitmaad_admin_token', authToken);
        currentUser = data.user;
        updateUserUI();
        authScreen.style.display = 'none';
        appShell.style.display = 'flex';
        showToast(`Welcome back, ${data.user.name}!`);
        loadAllData();
      } else {
        errorDiv.textContent = data.message || 'Login failed';
        errorDiv.style.display = 'block';
      }
    } catch (err) {
      errorDiv.textContent = 'Network or server error during sign in';
      errorDiv.style.display = 'block';
    }
  });

  // Handle Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('aitmaad_admin_token');
    authToken = '';
    currentUser = null;
    authScreen.style.display = 'flex';
    appShell.style.display = 'none';
    showToast('Signed out successfully');
  });
}

async function verifySession() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      updateUserUI();
      document.getElementById('auth-screen').style.display = 'none';
      document.getElementById('app-shell').style.display = 'flex';
      loadAllData();
    } else {
      throw new Error('Expired session');
    }
  } catch (err) {
    localStorage.removeItem('aitmaad_admin_token');
    authToken = '';
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app-shell').style.display = 'none';
  }
}

function updateUserUI() {
  if (currentUser) {
    document.getElementById('current-user-name').textContent = currentUser.name || currentUser.username;
    const initials = (currentUser.name || currentUser.username).substring(0, 2).toUpperCase();
    document.getElementById('current-user-initials').textContent = initials;
  }
}

// 2. Navigation Tab Switcher
function bindNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });
}

window.switchTab = function(tabName) {
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(i => {
    i.classList.toggle('active', i.getAttribute('data-tab') === tabName);
  });

  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.style.display = 'none';
  });

  const activePanel = document.getElementById(`tab-${tabName}`);
  if (activePanel) {
    activePanel.style.display = 'block';
  }

  // Update topbar title
  const titles = {
    'overview': 'Dashboard Overview',
    'projects': 'Projects Portfolio Manager',
    'services': 'Services Manager',
    'categories': 'Categories & Taxonomies',
    'spotlight': 'Spotlight Section Banner',
    'testimonials': 'Client Testimonials',
    'clients': 'Marquee Client Brands',
    'media': 'Media Library & Uploads',
    'branding': 'Logo, Favicon & Brand Identity',
    'site-content': 'Hero Section, Buttons & Stats',
    'navigation': 'Header Navigation Menu Links',
    'footer': 'Footer Info & Social Media Links',
    'inquiries': 'Customer Quotes & Inquiries Inbox',
    'settings': 'Admin Security & Password'
  };
  document.getElementById('page-heading').textContent = titles[tabName] || 'Dashboard';
};

// 3. Load All Data
async function loadAllData() {
  await Promise.all([
    loadProjects(),
    loadServices(),
    loadCategories(),
    loadNavigation(),
    loadTestimonials(),
    loadClients(),
    loadContent(),
    loadInquiries(),
    loadMedia()
  ]);
  updateDashboardKPIs();
}

// API Helper with Auth
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {};
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const options = {
    method,
    headers
  };
  if (body) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (res.status === 401) {
    localStorage.removeItem('aitmaad_admin_token');
    location.reload();
  }
  return res.json();
}

// 4. Projects Management
async function loadProjects() {
  const data = await apiRequest('/projects');
  if (data.success) {
    appState.projects = data.projects;
    renderProjectsTable();
  }
}

function renderProjectsTable() {
  const tbody = document.getElementById('projects-table-body');
  document.getElementById('projects-total-count').textContent = appState.projects.length;
  tbody.innerHTML = appState.projects.map(p => `
    <tr>
      <td>
        <img src="/${(p.cover || '').replace(/^\.?\/?/, '')}" alt="${p.title}" class="data-table-img" onerror="this.src='/assets/projects/project-1-thumb.webp'">
      </td>
      <td>
        <strong style="color: var(--admin-text-main); font-size: 0.92rem;">${p.title}</strong>
        <div style="font-size: 0.78rem; color: var(--admin-text-muted);">Slug: ${p.slug}</div>
      </td>
      <td><span class="badge badge-blue">${p.category}</span></td>
      <td>${p.location}</td>
      <td><strong>${p.span}</strong><br><span style="color: var(--admin-text-muted); font-size: 0.8rem;">${p.area}</span></td>
      <td>${p.client}</td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm" onclick="editProject('${p.id || p.slug}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject('${p.id || p.slug}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.editProject = function(idOrSlug) {
  const p = appState.projects.find(x => x.id === idOrSlug || x.slug === idOrSlug);
  if (!p) return;

  document.getElementById('proj-id').value = p.id || p.slug;
  document.getElementById('proj-title').value = p.title || '';
  document.getElementById('proj-category').value = p.category || 'Industrial';
  document.getElementById('proj-location').value = p.location || '';
  document.getElementById('proj-client').value = p.client || '';
  document.getElementById('proj-area').value = p.area || '';
  document.getElementById('proj-span').value = p.span || '';
  document.getElementById('proj-eave').value = p.eaveHeight || '';
  document.getElementById('proj-tonnage').value = p.steelTonnage || '';
  document.getElementById('proj-year').value = p.year || 2025;
  document.getElementById('proj-duration').value = p.duration || '';
  document.getElementById('proj-cover').value = p.cover || '';
  document.getElementById('proj-scope').value = Array.isArray(p.scope) ? p.scope.join(', ') : (p.scope || '');
  document.getElementById('proj-overview').value = p.overview || '';
  document.getElementById('proj-challenge').value = p.challenge || '';
  document.getElementById('proj-solution').value = p.solution || '';
  document.getElementById('proj-result').value = p.result || '';
  document.getElementById('proj-featured').checked = Boolean(p.featured);

  document.getElementById('project-modal-title').textContent = 'Edit Project Specifications';
  openModal('modal-project');
};

window.deleteProject = async function(idOrSlug) {
  if (!confirm('Are you sure you want to permanently delete this project?')) return;
  const res = await apiRequest(`/projects/${idOrSlug}`, 'DELETE');
  if (res.success) {
    showToast('Project deleted successfully');
    await loadProjects();
    updateDashboardKPIs();
  } else {
    showToast(res.message || 'Error deleting project', 'error');
  }
};

document.getElementById('btn-add-project').addEventListener('click', () => {
  document.getElementById('project-form').reset();
  document.getElementById('proj-id').value = '';
  document.getElementById('project-modal-title').textContent = 'Add New Project';
  openModal('modal-project');
});

document.getElementById('btn-save-project').addEventListener('click', async () => {
  const id = document.getElementById('proj-id').value;
  const projectData = {
    title: document.getElementById('proj-title').value.trim(),
    category: document.getElementById('proj-category').value,
    location: document.getElementById('proj-location').value.trim(),
    client: document.getElementById('proj-client').value.trim(),
    area: document.getElementById('proj-area').value.trim(),
    span: document.getElementById('proj-span').value.trim(),
    eaveHeight: document.getElementById('proj-eave').value.trim(),
    steelTonnage: document.getElementById('proj-tonnage').value.trim(),
    year: Number(document.getElementById('proj-year').value) || 2025,
    duration: document.getElementById('proj-duration').value.trim(),
    cover: document.getElementById('proj-cover').value.trim() || 'assets/projects/project-1-thumb.webp',
    gallery: [document.getElementById('proj-cover').value.trim() || 'assets/projects/project-1.webp'],
    scope: document.getElementById('proj-scope').value.split(',').map(s => s.trim()).filter(Boolean),
    overview: document.getElementById('proj-overview').value.trim(),
    challenge: document.getElementById('proj-challenge').value.trim(),
    solution: document.getElementById('proj-solution').value.trim(),
    result: document.getElementById('proj-result').value.trim(),
    featured: document.getElementById('proj-featured').checked
  };

  if (!projectData.title) {
    alert('Please enter a project title');
    return;
  }

  const method = id ? 'PUT' : 'POST';
  const url = id ? `/projects/${id}` : '/projects';

  const res = await apiRequest(url, method, projectData);
  if (res.success) {
    closeModal('modal-project');
    showToast(id ? 'Project updated successfully' : 'New project added successfully');
    await loadProjects();
    updateDashboardKPIs();
  } else {
    showToast(res.message || 'Error saving project', 'error');
  }
});

// 5. Clients Marquee Management
async function loadClients() {
  const data = await apiRequest('/clients');
  if (data.success) {
    appState.clients = data.clients;
    renderClientsTable();
  }
}

function renderClientsTable() {
  const tbody = document.getElementById('clients-table-body');
  tbody.innerHTML = appState.clients.map(c => `
    <tr>
      <td><strong style="letter-spacing: 0.05em; font-size: 0.95rem;">${c.name}</strong></td>
      <td><span style="color: var(--admin-text-muted); font-size: 0.8rem;">${c.logo || 'Standard Typography Mark'}</span></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteClient('${c.id}')">Remove</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('btn-add-client').addEventListener('click', async () => {
  const name = prompt('Enter Client Company / Brand Name (e.g. NISHAT MILLS):');
  if (!name || !name.trim()) return;

  const res = await apiRequest('/clients', 'POST', { name: name.trim() });
  if (res.success) {
    showToast(`Added ${name.toUpperCase()} to Marquee`);
    await loadClients();
    updateDashboardKPIs();
  } else {
    showToast(res.message || 'Error adding client', 'error');
  }
});

window.deleteClient = async function(id) {
  if (!confirm('Remove this client from the scrolling marquee?')) return;
  const res = await apiRequest(`/clients/${id}`, 'DELETE');
  if (res.success) {
    showToast('Client removed');
    await loadClients();
    updateDashboardKPIs();
  }
};

// 6. Testimonials Management
async function loadTestimonials() {
  const data = await apiRequest('/testimonials');
  if (data.success) {
    appState.testimonials = data.testimonials;
    renderTestimonialsTable();
  }
}

function renderTestimonialsTable() {
  const tbody = document.getElementById('testimonials-table-body');
  tbody.innerHTML = appState.testimonials.map(t => `
    <tr>
      <td><strong>${t.author}</strong><br><span style="color: var(--admin-text-muted); font-size: 0.8rem;">${t.designation}</span></td>
      <td>${t.company}</td>
      <td>${t.location}</td>
      <td style="max-width: 320px; font-size: 0.85rem;">"${t.quote.substring(0, 90)}..."</td>
      <td><span class="badge badge-amber">★ ${t.rating} / 5</span></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteTestimonial('${t.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('btn-add-testimonial').addEventListener('click', async () => {
  const author = prompt('Client Reviewer Name (e.g. Mian Tariq):');
  if (!author) return;
  const company = prompt('Company Name (e.g. Falcon Logistics):');
  if (!company) return;
  const quote = prompt('Review / Testimonial Quote:');
  if (!quote) return;

  const res = await apiRequest('/testimonials', 'POST', {
    author,
    company,
    quote,
    location: 'Pakistan',
    rating: 5,
    designation: 'Managing Director'
  });
  if (res.success) {
    showToast('Testimonial published');
    await loadTestimonials();
    updateDashboardKPIs();
  }
});

window.deleteTestimonial = async function(id) {
  if (!confirm('Delete this client testimonial?')) return;
  const res = await apiRequest(`/testimonials/${id}`, 'DELETE');
  if (res.success) {
    showToast('Testimonial deleted');
    await loadTestimonials();
    updateDashboardKPIs();
  }
};

// 7. Services Management
async function loadServices() {
  const data = await apiRequest('/services');
  if (data.success) {
    appState.services = data.services;
    renderServicesTable();
  }
}

function renderServicesTable() {
  const tbody = document.getElementById('services-table-body');
  tbody.innerHTML = appState.services.map(s => `
    <tr>
      <td><strong>${s.title}</strong></td>
      <td><code>${s.slug}</code></td>
      <td>${s.tagline || ''}</td>
      <td><span class="badge badge-blue">${(s.features || []).length} Points</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editServicePrompt('${s.id || s.slug}')">Edit Title</button>
      </td>
    </tr>
  `).join('');
}

window.editServicePrompt = async function(idOrSlug) {
  const s = appState.services.find(x => x.id === idOrSlug || x.slug === idOrSlug);
  if (!s) return;
  const newTitle = prompt('Edit Service Title:', s.title);
  if (!newTitle || newTitle === s.title) return;

  const res = await apiRequest(`/services/${s.id || s.slug}`, 'PUT', { title: newTitle });
  if (res.success) {
    showToast('Service updated');
    loadServices();
  }
};

document.getElementById('btn-add-service').addEventListener('click', async () => {
  const title = prompt('Enter New Service Title (e.g. Aircraft Hangars & Bulk Domes):');
  if (!title) return;
  const tagline = prompt('Short Tagline:', 'High-clearance specialized steel infrastructure');
  
  const res = await apiRequest('/services', 'POST', {
    title,
    tagline,
    description: 'Custom engineered high-performance pre-engineered steel structure.'
  });
  if (res.success) {
    showToast('Service added');
    loadServices();
  }
});

// 8. Content & Site Settings Form Bindings
async function loadContent() {
  const data = await apiRequest('/content');
  if (data.success) {
    appState.content = data;

    // Populate Hero Form
    const h = data.heroContent || {};
    document.getElementById('hero-live-badge').value = h.liveBadge || '';
    document.getElementById('hero-eyebrow').value = h.eyebrow || '';
    document.getElementById('hero-title-lead').value = h.titleLead || '';
    document.getElementById('hero-title-accent').value = h.titleAccent || '';
    document.getElementById('hero-sub').value = h.sub || '';
    document.getElementById('hero-bullet1').value = h.bullet1 || '';
    document.getElementById('hero-bullet2').value = h.bullet2 || '';
    document.getElementById('hero-bullet3').value = h.bullet3 || '';
    document.getElementById('hero-btn1-text').value = h.primaryBtnText || 'Request a Quote';
    document.getElementById('hero-btn1-link').value = h.primaryBtnLink || 'pages/contact.html';
    document.getElementById('hero-btn2-text').value = h.secondaryBtnText || 'Explore Projects';
    document.getElementById('hero-btn2-link').value = h.secondaryBtnLink || 'pages/projects.html';

    // Populate Site Settings Form
    const s = data.siteSettings || {};
    document.getElementById('settings-company-name').value = s.companyName || 'Aitmaad Engineering';
    document.getElementById('settings-phone').value = s.phone || '+92 300 4589192';
    document.getElementById('settings-whatsapp').value = s.whatsapp || '923004589192';
    document.getElementById('settings-email').value = s.email || 'aitmaadengineering@gmail.com';
    document.getElementById('settings-pec').value = s.pecNumber || 'PEC C1 / Verified';
    document.getElementById('settings-hours').value = s.workingHours || 'Mon – Sat: 8:00 AM – 6:00 PM';
    document.getElementById('settings-address').value = s.address || '';

    // Populate Metrics Form
    const m = data.metrics || {};
    document.getElementById('metric-years').value = m.years || '10+';
    document.getElementById('metric-projects').value = m.projects || '100+';
    document.getElementById('metric-clients').value = m.clients || '40+';
    document.getElementById('metric-area').value = m.areaBuilt || '1M+';

    // Populate Branding Form
    const b = data.branding || {};
    appState.branding = b;
    if (document.getElementById('brand-site-name')) {
      document.getElementById('brand-site-name').value = b.siteName || 'Aitmaad Engineering';
      document.getElementById('brand-tagline').value = b.tagline || '';
      document.getElementById('brand-logo').value = b.logo || 'assets/logo.svg';
      document.getElementById('brand-favicon').value = b.favicon || 'assets/logo.svg';
      document.getElementById('brand-topbar').value = b.topbarAnnouncement || '';
      document.getElementById('brand-header-btn-text').value = b.headerCtaText || 'Request a Quote';
      document.getElementById('brand-header-btn-link').value = b.headerCtaLink || 'pages/contact.html';
    }

    // Populate Spotlight Form
    const sp = data.spotlight || {};
    appState.spotlight = sp;
    if (document.getElementById('spotlight-title')) {
      document.getElementById('spotlight-eyebrow').value = sp.eyebrow || 'Project Spotlight';
      document.getElementById('spotlight-title').value = sp.title || '';
      document.getElementById('spotlight-desc').value = sp.desc || '';
      document.getElementById('spotlight-bg').value = sp.bgImage || 'assets/projects/project-15.webp';
      document.getElementById('spotlight-span-val').value = sp.clearSpanVal || '135';
      document.getElementById('spotlight-span-unit').value = sp.clearSpanUnit || 'Feet Clear Span';
      document.getElementById('spotlight-weight-val').value = sp.weightVal || '100';
      document.getElementById('spotlight-weight-unit').value = sp.weightUnit || 'Tons Steel Weight';
      document.getElementById('spotlight-area-val').value = sp.areaVal || '155000';
      document.getElementById('spotlight-area-unit').value = sp.areaUnit || 'Sq. Ft. Area';
      document.getElementById('spotlight-btn-text').value = sp.ctaText || 'Read the Case Study';
      document.getElementById('spotlight-btn-link').value = sp.ctaLink || 'pages/project.html?slug=comet-sports-manufacturing-facility';
    }

    // Populate Footer & Social Links Form
    const ft = data.footer || {};
    const soc = data.socialLinks || {};
    appState.footer = ft;
    appState.socialLinks = soc;
    if (document.getElementById('footer-copyright')) {
      document.getElementById('footer-about-brief').value = ft.aboutBrief || '';
      document.getElementById('footer-copyright').value = ft.copyrightNotice || '';
      document.getElementById('footer-pec-badge').value = ft.pecNotice || '';
      document.getElementById('social-whatsapp').value = soc.whatsapp || '';
      document.getElementById('social-linkedin').value = soc.linkedin || '';
      document.getElementById('social-facebook').value = soc.facebook || '';
      document.getElementById('social-instagram').value = soc.instagram || '';
      document.getElementById('social-youtube').value = soc.youtube || '';
    }
  }
}

function bindForms() {
  // Hero Form Submit
  document.getElementById('hero-content-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const heroContent = {
      liveBadge: document.getElementById('hero-live-badge').value.trim(),
      eyebrow: document.getElementById('hero-eyebrow').value.trim(),
      titleLead: document.getElementById('hero-title-lead').value.trim(),
      titleAccent: document.getElementById('hero-title-accent').value.trim(),
      sub: document.getElementById('hero-sub').value.trim(),
      bullet1: document.getElementById('hero-bullet1').value.trim(),
      bullet2: document.getElementById('hero-bullet2').value.trim(),
      bullet3: document.getElementById('hero-bullet3').value.trim(),
      primaryBtnText: document.getElementById('hero-btn1-text').value.trim(),
      primaryBtnLink: document.getElementById('hero-btn1-link').value.trim(),
      secondaryBtnText: document.getElementById('hero-btn2-text').value.trim(),
      secondaryBtnLink: document.getElementById('hero-btn2-link').value.trim()
    };
    const res = await apiRequest('/content/hero', 'PUT', heroContent);
    if (res.success) {
      showToast('Hero section & buttons successfully updated!');
    } else {
      showToast('Failed to update hero content', 'error');
    }
  });

  // Site Settings Form Submit
  document.getElementById('site-settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const siteSettings = {
      companyName: document.getElementById('settings-company-name').value.trim(),
      phone: document.getElementById('settings-phone').value.trim(),
      whatsapp: document.getElementById('settings-whatsapp').value.trim(),
      email: document.getElementById('settings-email').value.trim(),
      pecNumber: document.getElementById('settings-pec').value.trim(),
      workingHours: document.getElementById('settings-hours').value.trim(),
      address: document.getElementById('settings-address').value.trim()
    };
    const res = await apiRequest('/content/site-settings', 'PUT', siteSettings);
    if (res.success) {
      showToast('Company information successfully saved!');
    } else {
      showToast('Failed to save settings', 'error');
    }
  });

  // Metrics Form Submit
  document.getElementById('metrics-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const metrics = {
      years: document.getElementById('metric-years').value.trim(),
      projects: document.getElementById('metric-projects').value.trim(),
      clients: document.getElementById('metric-clients').value.trim(),
      areaBuilt: document.getElementById('metric-area').value.trim()
    };
    const res = await apiRequest('/content/metrics', 'PUT', metrics);
    if (res.success) {
      showToast('Statistics counters updated!');
    } else {
      showToast('Failed to update metrics', 'error');
    }
  });

  // Change Password Form
  document.getElementById('change-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('pw-current').value;
    const newPassword = document.getElementById('pw-new').value;
    const confirmPassword = document.getElementById('pw-confirm').value;

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match!', 'error');
      return;
    }

    const res = await apiRequest('/auth/change-password', 'POST', { currentPassword, newPassword });
    if (res.success) {
      showToast('Password successfully changed!');
      document.getElementById('change-password-form').reset();
    } else {
      showToast(res.message || 'Error changing password', 'error');
    }
  });

  // Branding Form Submit
  const brandingForm = document.getElementById('branding-form');
  if (brandingForm) {
    brandingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        siteName: document.getElementById('brand-site-name').value.trim(),
        tagline: document.getElementById('brand-tagline').value.trim(),
        logo: document.getElementById('brand-logo').value.trim(),
        favicon: document.getElementById('brand-favicon').value.trim(),
        topbarAnnouncement: document.getElementById('brand-topbar').value.trim(),
        headerCtaText: document.getElementById('brand-header-btn-text').value.trim(),
        headerCtaLink: document.getElementById('brand-header-btn-link').value.trim()
      };
      const res = await apiRequest('/content/branding', 'PUT', payload);
      if (res.success) {
        showToast('Logo & brand identity updated successfully!');
      } else {
        showToast('Error saving branding', 'error');
      }
    });
  }

  // Spotlight Form Submit
  const spotlightForm = document.getElementById('spotlight-form');
  if (spotlightForm) {
    spotlightForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        eyebrow: document.getElementById('spotlight-eyebrow').value.trim(),
        title: document.getElementById('spotlight-title').value.trim(),
        desc: document.getElementById('spotlight-desc').value.trim(),
        bgImage: document.getElementById('spotlight-bg').value.trim(),
        clearSpanVal: document.getElementById('spotlight-span-val').value.trim(),
        clearSpanUnit: document.getElementById('spotlight-span-unit').value.trim(),
        weightVal: document.getElementById('spotlight-weight-val').value.trim(),
        weightUnit: document.getElementById('spotlight-weight-unit').value.trim(),
        areaVal: document.getElementById('spotlight-area-val').value.trim(),
        areaUnit: document.getElementById('spotlight-area-unit').value.trim(),
        ctaText: document.getElementById('spotlight-btn-text').value.trim(),
        ctaLink: document.getElementById('spotlight-btn-link').value.trim()
      };
      const res = await apiRequest('/content/spotlight', 'PUT', payload);
      if (res.success) {
        showToast('Spotlight banner updated successfully!');
      } else {
        showToast('Error saving spotlight', 'error');
      }
    });
  }

  // Footer & Social Links Form Submit
  const footerForm = document.getElementById('footer-form');
  if (footerForm) {
    footerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const footerPayload = {
        aboutBrief: document.getElementById('footer-about-brief').value.trim(),
        copyrightNotice: document.getElementById('footer-copyright').value.trim(),
        pecNotice: document.getElementById('footer-pec-badge').value.trim()
      };
      const socialPayload = {
        whatsapp: document.getElementById('social-whatsapp').value.trim(),
        linkedin: document.getElementById('social-linkedin').value.trim(),
        facebook: document.getElementById('social-facebook').value.trim(),
        instagram: document.getElementById('social-instagram').value.trim(),
        youtube: document.getElementById('social-youtube').value.trim()
      };
      await apiRequest('/content/footer', 'PUT', footerPayload);
      await apiRequest('/content/social-links', 'PUT', socialPayload);
      showToast('Footer & Social profiles updated successfully!');
    });
  }

  // Save Category Button
  const btnSaveCat = document.getElementById('btn-save-category');
  if (btnSaveCat) {
    btnSaveCat.addEventListener('click', saveCategory);
  }

  // Save Nav Button
  const btnSaveNav = document.getElementById('btn-save-nav');
  if (btnSaveNav) {
    btnSaveNav.addEventListener('click', saveNav);
  }
}

// 9. Inquiries Inbox
async function loadInquiries() {
  const data = await apiRequest('/inquiries');
  if (data.success) {
    appState.inquiries = data.inquiries;
    renderInquiriesTables();
  }
}

function renderInquiriesTables() {
  const overviewTbody = document.getElementById('overview-inquiries-table');
  const fullTbody = document.getElementById('inquiries-table-body');
  const badge = document.getElementById('nav-inquiries-badge');

  const newCount = appState.inquiries.filter(i => i.status === 'new').length;
  if (newCount > 0) {
    badge.textContent = newCount;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }

  // Overview recent 5
  overviewTbody.innerHTML = appState.inquiries.slice(0, 5).map(inq => `
    <tr>
      <td>${new Date(inq.createdAt).toLocaleDateString()}</td>
      <td><strong>${inq.name}</strong></td>
      <td><a href="tel:${inq.phone}" style="color: var(--admin-primary); font-weight: 600;">${inq.phone}</a></td>
      <td><span class="badge badge-blue">${inq.projectType}</span></td>
      <td>
        <span class="badge ${inq.status === 'new' ? 'badge-amber' : inq.status === 'contacted' ? 'badge-green' : 'badge-blue'}">
          ${inq.status.toUpperCase()}
        </span>
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="switchTab('inquiries')">View</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align: center; color: var(--admin-text-muted);">No inquiries yet</td></tr>';

  // Full table
  fullTbody.innerHTML = appState.inquiries.map(inq => `
    <tr>
      <td>${new Date(inq.createdAt).toLocaleString()}</td>
      <td><strong>${inq.name}</strong><br><span style="color: var(--admin-text-muted); font-size: 0.8rem;">📍 ${inq.location || 'Not specified'}</span></td>
      <td><a href="tel:${inq.phone}" style="color: var(--admin-primary); font-weight: 700;">${inq.phone}</a></td>
      <td>${inq.email ? `<a href="mailto:${inq.email}">${inq.email}</a>` : '—'}</td>
      <td><span class="badge badge-blue">${inq.projectType}</span></td>
      <td style="max-width: 250px; font-size: 0.85rem;">
        ${inq.dimensions ? `<div><strong>Dimensions:</strong> ${inq.dimensions}</div>` : ''}
        ${inq.message ? `<div>${inq.message}</div>` : ''}
      </td>
      <td>
        <select class="form-control" style="font-size: 0.8rem; padding: 4px 8px;" onchange="updateInquiryStatus('${inq.id}', this.value)">
          <option value="new" ${inq.status === 'new' ? 'selected' : ''}>New Inquiry</option>
          <option value="contacted" ${inq.status === 'contacted' ? 'selected' : ''}>Contacted</option>
          <option value="closed" ${inq.status === 'closed' ? 'selected' : ''}>Closed / Won</option>
        </select>
      </td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteInquiry('${inq.id}')">Delete</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="8" style="text-align: center; color: var(--admin-text-muted);">No inquiries received yet</td></tr>';
}

window.updateInquiryStatus = async function(id, status) {
  const res = await apiRequest(`/inquiries/${id}`, 'PATCH', { status });
  if (res.success) {
    showToast(`Status updated to ${status}`);
    await loadInquiries();
    updateDashboardKPIs();
  }
};

window.deleteInquiry = async function(id) {
  if (!confirm('Permanently delete this quote inquiry record?')) return;
  const res = await apiRequest(`/inquiries/${id}`, 'DELETE');
  if (res.success) {
    showToast('Inquiry record deleted');
    await loadInquiries();
    updateDashboardKPIs();
  }
};

// 10. Media Library & File Uploads
async function loadMedia() {
  const data = await apiRequest('/media');
  if (data.success) {
    appState.media = data.files;
    renderMediaGrid();
  }
}

function renderMediaGrid() {
  const grid = document.getElementById('media-library-grid');
  grid.innerHTML = appState.media.map(m => `
    <div class="media-item">
      <img src="/${(m.url || '').replace(/^\.?\/?/, '')}" alt="${m.name}" class="media-thumb" loading="lazy">
      <div class="media-name" title="${m.name}">${m.name}</div>
      <div style="padding: 6px 8px; display: flex; gap: 4px; justify-content: space-between; background: #f8fafc; border-top: 1px solid var(--admin-border);">
        <button class="btn btn-secondary btn-sm" style="padding: 3px 6px; font-size: 0.72rem;" onclick="copyToClipboard('${m.url}')">Copy URL</button>
        <button class="btn btn-danger btn-sm" style="padding: 3px 6px; font-size: 0.72rem;" onclick="deleteMediaFile('${m.name}')">×</button>
      </div>
    </div>
  `).join('');
}

window.copyToClipboard = function(text) {
  navigator.clipboard.writeText(text);
  showToast('Image URL copied to clipboard: ' + text);
};

window.deleteMediaFile = async function(filename) {
  if (!confirm(`Delete ${filename}?`)) return;
  const res = await apiRequest(`/media/${filename}`, 'DELETE');
  if (res.success) {
    showToast('File deleted');
    loadMedia();
  } else {
    showToast(res.message || 'Error deleting file', 'error');
  }
};

function bindMediaUpload() {
  const dropzone = document.getElementById('media-dropzone');
  const fileInput = document.getElementById('media-file-input');

  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      await uploadMediaFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', async (e) => {
    if (e.target.files.length > 0) {
      await uploadMediaFile(e.target.files[0]);
    }
  });

  // Generic quick upload for project modal
  const genericInput = document.getElementById('generic-file-input');
  genericInput.addEventListener('change', async (e) => {
    if (e.target.files.length > 0 && currentTargetUploadInput) {
      const res = await uploadFileDirect(e.target.files[0]);
      if (res && res.url) {
        document.getElementById(currentTargetUploadInput).value = res.url;
        showToast('Photo uploaded and path set!');
      }
    }
  });
}

window.triggerQuickUpload = function(inputId) {
  currentTargetUploadInput = inputId;
  document.getElementById('generic-file-input').click();
};

async function uploadMediaFile(file) {
  const res = await uploadFileDirect(file);
  if (res && res.success) {
    showToast(`Uploaded ${file.name}`);
    loadMedia();
  } else {
    showToast('Upload failed', 'error');
  }
}

async function uploadFileDirect(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });
    return await res.json();
  } catch (err) {
    console.error('File upload error:', err);
    return null;
  }
}

// 11. Modal Utilities
window.openModal = function(id) {
  document.getElementById(id).classList.add('open');
};

window.closeModal = function(id) {
  document.getElementById(id).classList.remove('open');
};

function updateDashboardKPIs() {
  document.getElementById('kpi-projects-count').textContent = appState.projects.length;
  document.getElementById('kpi-inquiries-count').textContent = appState.inquiries.length;
  document.getElementById('kpi-clients-count').textContent = appState.clients.length;
  document.getElementById('kpi-testimonials-count').textContent = appState.testimonials.length;
}

// 12. Categories (Taxonomies) Management
async function loadCategories() {
  const data = await apiRequest('/content');
  if (data.success && data.categories) {
    appState.categories = data.categories;
    renderCategoriesTable();
    populateCategoryDropdown();
  }
}

function renderCategoriesTable() {
  const tbody = document.getElementById('categories-table-body');
  if (!tbody) return;
  tbody.innerHTML = appState.categories.map(cat => `
    <tr>
      <td><strong>${cat.name}</strong></td>
      <td><code>${cat.slug}</code></td>
      <td style="color: var(--admin-text-muted); font-size: 0.85rem;">${cat.description || '—'}</td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm" onclick="editCategory('${cat.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteCategory('${cat.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="4" style="text-align: center; color: var(--admin-text-muted);">No categories added yet</td></tr>';
}

function populateCategoryDropdown() {
  const select = document.getElementById('proj-category');
  if (!select || !appState.categories.length) return;
  const currentVal = select.value;
  select.innerHTML = appState.categories.map(c => `
    <option value="${c.name}">${c.name}</option>
  `).join('');
  if (currentVal) select.value = currentVal;
}

window.openCategoryModal = function() {
  document.getElementById('cat-id').value = '';
  document.getElementById('cat-name').value = '';
  document.getElementById('cat-slug').value = '';
  document.getElementById('cat-desc').value = '';
  document.getElementById('category-modal-title').textContent = 'Add Category';
  openModal('modal-category');
};

window.editCategory = function(id) {
  const cat = appState.categories.find(c => c.id === id);
  if (!cat) return;
  document.getElementById('cat-id').value = cat.id;
  document.getElementById('cat-name').value = cat.name;
  document.getElementById('cat-slug').value = cat.slug;
  document.getElementById('cat-desc').value = cat.description || '';
  document.getElementById('category-modal-title').textContent = 'Edit Category';
  openModal('modal-category');
};

async function saveCategory() {
  const id = document.getElementById('cat-id').value;
  const name = document.getElementById('cat-name').value.trim();
  const slug = document.getElementById('cat-slug').value.trim() || name.toLowerCase().replace(/\s+/g, '-');
  const desc = document.getElementById('cat-desc').value.trim();

  if (!name) {
    showToast('Category name is required', 'error');
    return;
  }

  let updatedList = [...appState.categories];
  if (id) {
    updatedList = updatedList.map(c => c.id === id ? { ...c, name, slug, description: desc } : c);
  } else {
    updatedList.push({ id: 'cat-' + Date.now(), name, slug, description: desc });
  }

  const res = await apiRequest('/content/categories', 'PUT', updatedList);
  if (res.success) {
    showToast('Category saved successfully!');
    closeModal('modal-category');
    appState.categories = updatedList;
    renderCategoriesTable();
    populateCategoryDropdown();
  } else {
    showToast('Failed to save category', 'error');
  }
}

window.deleteCategory = async function(id) {
  if (!confirm('Are you sure you want to delete this category?')) return;
  const updatedList = appState.categories.filter(c => c.id !== id);
  const res = await apiRequest('/content/categories', 'PUT', updatedList);
  if (res.success) {
    showToast('Category deleted');
    appState.categories = updatedList;
    renderCategoriesTable();
    populateCategoryDropdown();
  }
};

// 13. Navigation Links Management
async function loadNavigation() {
  const data = await apiRequest('/content');
  if (data.success && data.navigation) {
    appState.navigation = data.navigation;
    renderNavigationTable();
  }
}

function renderNavigationTable() {
  const tbody = document.getElementById('navigation-table-body');
  if (!tbody) return;
  tbody.innerHTML = appState.navigation.map((item, idx) => `
    <tr>
      <td><strong>${item.label}</strong></td>
      <td><code>${item.url}</code></td>
      <td><span class="badge badge-blue">${item.target || '_self'}</span></td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm" onclick="editNav('${item.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteNav('${item.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="4" style="text-align: center; color: var(--admin-text-muted);">No navigation links added yet</td></tr>';
}

window.openNavModal = function() {
  document.getElementById('nav-item-id').value = '';
  document.getElementById('nav-item-label').value = '';
  document.getElementById('nav-item-url').value = '';
  document.getElementById('nav-item-target').value = '_self';
  document.getElementById('nav-modal-title').textContent = 'Add Menu Link';
  openModal('modal-nav');
};

window.editNav = function(id) {
  const item = appState.navigation.find(n => n.id === id);
  if (!item) return;
  document.getElementById('nav-item-id').value = item.id;
  document.getElementById('nav-item-label').value = item.label;
  document.getElementById('nav-item-url').value = item.url;
  document.getElementById('nav-item-target').value = item.target || '_self';
  document.getElementById('nav-modal-title').textContent = 'Edit Menu Link';
  openModal('modal-nav');
};

async function saveNav() {
  const id = document.getElementById('nav-item-id').value;
  const label = document.getElementById('nav-item-label').value.trim();
  const url = document.getElementById('nav-item-url').value.trim();
  const target = document.getElementById('nav-item-target').value;

  if (!label || !url) {
    showToast('Label and URL are required', 'error');
    return;
  }

  let updatedList = [...appState.navigation];
  if (id) {
    updatedList = updatedList.map(n => n.id === id ? { ...n, label, url, target } : n);
  } else {
    updatedList.push({ id: 'nav-' + Date.now(), label, url, target });
  }

  const res = await apiRequest('/content/navigation', 'PUT', updatedList);
  if (res.success) {
    showToast('Navigation link saved!');
    closeModal('modal-nav');
    appState.navigation = updatedList;
    renderNavigationTable();
  } else {
    showToast('Failed to save navigation', 'error');
  }
}

window.deleteNav = async function(id) {
  if (!confirm('Remove this link from header navigation?')) return;
  const updatedList = appState.navigation.filter(n => n.id !== id);
  const res = await apiRequest('/content/navigation', 'PUT', updatedList);
  if (res.success) {
    showToast('Link removed from navigation');
    appState.navigation = updatedList;
    renderNavigationTable();
  }
};

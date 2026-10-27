# Aitmad Engineering (اعتماد انجینئرنگ)
### Complete Website Design & Build Documentation

> **Built on Trust. Engineered in Steel.**  
> Pakistan's premier corporate engineering web platform for Pre-Engineered Buildings (PEB), structural steel fabrication, high-bay warehouses, and industrial sheds.

---

## 🏗️ Architecture & Directory Overview

```
/aitmad-engineering
├── index.html                  # 12-section flagship home page with 3D Three.js hero
├── sitemap.xml                 # Search engine XML sitemap
├── robots.txt                  # Web crawler instructions
├── README.md                   # Complete owner customization & deployment guide
├── pages/
│   ├── about.html              # Company history, milestone timeline, leadership & facility
│   ├── services.html           # Services overview & comparison matrix (PEB vs RCC)
│   ├── service-peb.html        # Pre-Engineered Buildings (PEB) detail page
│   ├── service-structural-steel.html # Structural steel fabrication & erection
│   ├── service-warehouses.html # Warehouses & cold storages (-40°C to +15°C)
│   ├── service-factories.html  # Factories & industrial sheds
│   ├── service-roofing.html    # Standing seam roofing, cladding & insulation
│   ├── service-consultancy.html# Design, structural analysis & BIM LOD 400
│   ├── projects.html           # Filterable gallery & instant search
│   ├── project.html            # Dynamic project detail template (?slug=...)
│   ├── process.html            # 6-step engineered execution methodology
│   ├── why-aitmad.html         # Credentials, PEC C1, AWS welding, 2M+ safe hours
│   ├── contact.html            # 2-column contact & quote request with validation
│   ├── 404.html                # Custom branded 404 error page
│   └── privacy.html            # Corporate privacy policy & NDA terms
├── css/
│   ├── tokens.css              # Design tokens (Deep Pine, Brushed Copper, typography)
│   ├── base.css                # Base reset, blueprint grid, corner brackets, RTL support
│   ├── components.css          # Header, footer, buttons, marquee, accordion, modals
│   └── pages.css               # Hero 3D styling, stats grid, project detail layout
├── js/
│   ├── main.js                 # App coordinator (preloader, cursor, counters, slider)
│   ├── hero3d.js               # Three.js interactive 3D steel portal frame scene
│   ├── projects.js             # Project card renderer, instant search, lightbox & detail
│   ├── forms.js                # Quote form validation, honeypot anti-spam, success state
│   └── i18n.js                 # English & Urdu bilingual dictionary with RTL toggle
├── data/
│   ├── projects.js             # Single source of truth for all project case studies
│   ├── services.js             # Services data model, specs tables & FAQs
│   └── testimonials.js         # Enterprise client endorsements
└── assets/
    ├── logo.svg                # Brand logo for dark backgrounds
    └── logo-dark.svg           # Brand logo for light surfaces
```

---

## 🎨 How to Customize Brand Colors

All colors are controlled in **`css/tokens.css`**:

```css
:root {
  /* Main Color: Deep Pine */
  --pine-900: #0A2622;
  --pine-800: #0E3B36; /* Main brand surface */
  --pine-700: #14504A;
  --pine-500: #2B7A70;
  --pine-100: #DCEBE8;

  /* Support Accent: Brushed Copper */
  --copper-600: #A36B43;
  --copper-500: #BC8458; /* Primary button and numbers */
  --copper-300: #DDB791;

  /* Light Neutrals */
  --ivory: #F6F3EE;      /* Main light background */
  --white: #FFFFFF;      /* Card background */
}
```

- To change the accent copper or pine tone, simply adjust the hex code in `css/tokens.css`. The whole site updates instantly.

---

## 📁 How to Add or Edit Projects

Projects are stored in a single file: **`data/projects.js`**. You do **not** need to touch any HTML files to add a project.

Simply append a new object to the `projects` array:

```javascript
{
  slug: "new-cement-plant-shed",
  title: "Fauji Cement Clinker Storage Dome",
  category: "Industrial",       // Industrial | Warehouse | Commercial | Agricultural | Institutional
  location: "D.G. Khan, Punjab",
  area: "180,000 sq. ft.",
  span: "54 m",
  eaveHeight: "18 m",
  year: 2026,
  duration: "6 Months",
  client: "Fauji Cement Company Ltd.",
  scope: ["Structural Design", "Fabrication", "Heavy Erection"],
  cover: "https://your-domain.com/path-to-photo.jpg",
  gallery: [
    "https://your-domain.com/gallery-1.jpg",
    "https://your-domain.com/gallery-2.jpg"
  ],
  overview: "Detailed project description...",
  challenge: "Engineering hurdles solved...",
  solution: "Aitmad's technical approach...",
  result: "Quantifiable project outcomes...",
  featured: true               // Set to true to show in home page featured list
}
```

The Home Page editorial grid, Projects gallery, instant search, and dynamic Project Detail template (`project.html?slug=new-cement-plant-shed`) will automatically display it.

---

## 🖼️ How to Replace Placeholder Images

1. Place your real project photography in the `assets/` directory (e.g., `assets/projects/my-warehouse.webp`).
2. Update the image paths in:
   - `data/projects.js` (`cover` and `gallery` arrays)
   - Or replace individual section image tags in HTML files.

---

## 🌐 Connecting the Request a Quote Form

The quote forms in `pages/contact.html` and `index.html` are managed by **`js/forms.js`**.

To connect to **Formspree** or your custom mail endpoint:
1. Open `js/forms.js`.
2. Locate line 60:
   ```javascript
   // Replace this simulated submission with your real endpoint:
   fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(payload)
   });
   ```
3. Form fields include automated validation for Pakistani phone formats (`03xx-xxxxxxx` or `+92...`), email validation, and a hidden honeypot anti-spam trap.

---

## 🚀 Deployment Instructions

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub (`waseem-abbas12/aitmad-engineering`).
2. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Leave build settings as default (Static HTML) and click **Deploy**.

### Deploying to Netlify
1. Drag and drop the `aitmad-engineering` folder into Netlify Drop, or connect via GitHub.
2. Publish directory: `./` (Root).

---

## ⚡ Performance, Accessibility & SEO Standards

- **Color Contrast:** Strict WCAG AA compliance (4.5:1 ratio for all body text).
- **Reduced Motion:** Automatic fallback to Ken Burns image zoom when user has `prefers-reduced-motion` enabled.
- **Bilingual RTL Support:** Real-time English / Urdu toggle with automatic `dir="rtl"` layout mirroring and Noto Nastaliq Urdu typography.
- **Mobile First:** Fully responsive from 360px smartphones to 4K ultra-wide monitors.

---

© 2026 Aitmad Engineering (Pvt.) Ltd. All Rights Reserved. Engineered for Trust.

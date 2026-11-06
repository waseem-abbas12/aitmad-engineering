import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');

async function seed() {
  const dbDir = path.join(ROOT_DIR, 'server', 'database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Import existing data modules
  const { projects } = await import('../../data/projects.js');
  const { testimonials } = await import('../../data/testimonials.js');
  const { services } = await import('../../data/services.js');

  const defaultAdminPassword = await bcrypt.hash('Aitmaad@2026', 10);

  const cmsData = {
    siteSettings: {
      companyName: "Aitmaad Engineering",
      tagline: "Pre-Engineered Steel Buildings & Industrial Construction Pakistan",
      phone: "+92 300 4589192",
      phoneRaw: "03004589192",
      email: "aitmaadengineering@gmail.com",
      address: "First floor, 102 park view, quaid commercial, opposite to Eiffel Tower, Bahria town lahore",
      city: "Lahore",
      country: "Pakistan",
      whatsapp: "923004589192",
      pecNumber: "PEC C1 / Verified",
      workingHours: "Mon – Sat: 8:00 AM – 6:00 PM"
    },
    heroContent: {
      eyebrow: "Steel Building Specialists",
      liveBadge: "Pakistan's #1 Certified PEB & Structural Steel Specialists",
      titleLead: "Turnkey Pre-Engineered Steel Buildings & ",
      titleAccent: "High-Bay Warehouses",
      sub: "From Tekla LOD 400 engineering to certified fabrication and rapid nationwide site erection — 100+ delivered facilities across Pakistan.",
      bullet1: "Turnkey PEB: Column-Free Spans up to 90m",
      bullet2: "Certified Steel: ASTM A572 Grade 50 & AWS Certified",
      bullet3: "BIM Precision: In-house Tekla LOD 400 & STAAD Detailing",
      primaryBtnText: "Request a Quote",
      primaryBtnLink: "pages/contact.html",
      secondaryBtnText: "Explore Projects",
      secondaryBtnLink: "pages/projects.html"
    },
    metrics: {
      years: "10+",
      yearsLabel: "Years Proven Experience",
      projects: "100+",
      projectsLabel: "Nationwide Delivered",
      clients: "80+",
      clientsLabel: "Corporate Trusts",
      areaBuilt: "3.5M+",
      areaBuiltLabel: "Sq. Ft. Constructed"
    },
    clientsMarquee: [
      { id: "c1", name: "GREEN APPLE FARMS", logo: "" },
      { id: "c2", name: "SHAFI TEXCEL GROUP", logo: "" },
      { id: "c3", name: "GOFY FOOD INDUSTRIES", logo: "" },
      { id: "c4", name: "SAMSON'S GROUP", logo: "" },
      { id: "c5", name: "AGUILA ACTIVE (PVT)", logo: "" },
      { id: "c6", name: "PETROMAN SAFETY INTERNATIONAL", logo: "" },
      { id: "c7", name: "PAK AFSON ENTERPRISES", logo: "" },
      { id: "c8", name: "EVERFRESH FARMS (PVT) LTD", logo: "" },
      { id: "c9", name: "WELDON INSTRUMENT", logo: "" },
      { id: "c10", name: "FOUR SEASON'S DAIRY FARMS", logo: "" },
      { id: "c11", name: "COMET SPORTS", logo: "" }
    ],
    projects: projects.map((p, idx) => ({ id: `proj_${idx + 1}`, ...p })),
    services: services.map((s, idx) => ({ id: `serv_${idx + 1}`, ...s })),
    testimonials: testimonials.map((t, idx) => ({ id: `test_${idx + 1}`, ...t })),
    users: [
      {
        id: "usr_admin",
        username: "admin",
        passwordHash: defaultAdminPassword,
        role: "superadmin",
        name: "Aitmaad Admin"
      }
    ],
    inquiries: [
      {
        id: "inq_demo_1",
        name: "Muhammad Usman",
        phone: "+92 321 4455667",
        email: "usman@industrialcorp.pk",
        projectType: "peb",
        dimensions: "120ft x 250ft x 28ft eave height",
        location: "Sundar Industrial Estate, Lahore",
        message: "Need turnkey quote for textile warehouse with 10-ton crane beam runway.",
        createdAt: new Date().toISOString(),
        status: "new"
      }
    ]
  };

  const dbPath = path.join(dbDir, 'cms_data.json');
  fs.writeFileSync(dbPath, JSON.stringify(cmsData, null, 2), 'utf-8');
  console.log(`CMS Database successfully seeded at: ${dbPath}`);
}

seed().catch(console.error);

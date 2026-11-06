import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../');
const DB_PATH = path.join(__dirname, 'database', 'cms_data.json');

export function getDB() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error('Database not initialized. Please run init_cms.js');
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  syncStaticFiles(data);
}

// Automatically syncs CMS database to frontend static modules
export function syncStaticFiles(data) {
  try {
    // 1. Sync data/projects.js
    if (data.projects) {
      const projectsJsPath = path.join(ROOT_DIR, 'data', 'projects.js');
      const projectsClean = data.projects.map(p => {
        const copy = { ...p };
        delete copy.id; // remove internal cms id
        return copy;
      });
      const fileContent = `/**
 * Aitmaad Engineering - Projects Data Model
 * Auto-synced from Aitmaad CMS Backend
 */

export const projects = ${JSON.stringify(projectsClean, null, 2)};
`;
      fs.writeFileSync(projectsJsPath, fileContent, 'utf-8');
    }

    // 2. Sync data/testimonials.js
    if (data.testimonials) {
      const testJsPath = path.join(ROOT_DIR, 'data', 'testimonials.js');
      const testClean = data.testimonials.map(t => {
        const copy = { ...t };
        return copy;
      });
      const fileContent = `/**
 * Aitmaad Engineering - Testimonials Data Model
 * Auto-synced from Aitmaad CMS Backend
 */

export const testimonials = ${JSON.stringify(testClean, null, 2)};
`;
      fs.writeFileSync(testJsPath, fileContent, 'utf-8');
    }

    // 3. Sync data/services.js
    if (data.services) {
      const servJsPath = path.join(ROOT_DIR, 'data', 'services.js');
      const servClean = data.services.map(s => {
        const copy = { ...s };
        delete copy.id;
        return copy;
      });
      const fileContent = `/**
 * Aitmaad Engineering - Services Data Model
 * Auto-synced from Aitmaad CMS Backend
 */

export const services = ${JSON.stringify(servClean, null, 2)};
`;
      fs.writeFileSync(servJsPath, fileContent, 'utf-8');
    }

    // 4. Sync public site-content.json for instant frontend consumption
    const publicContentPath = path.join(ROOT_DIR, 'data', 'site-content.json');
    const publicContent = {
      siteSettings: data.siteSettings,
      heroContent: data.heroContent,
      metrics: data.metrics,
      clientsMarquee: data.clientsMarquee
    };
    fs.writeFileSync(publicContentPath, JSON.stringify(publicContent, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error auto-syncing static files:', err);
  }
}

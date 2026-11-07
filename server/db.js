import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultCMSData } from './database/default_data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../');

const isVercel = Boolean(process.env.VERCEL);
const DB_PATH = isVercel
  ? path.join('/tmp', 'cms_data.json')
  : path.join(__dirname, 'database', 'cms_data.json');

let memoryDB = null;

export function getDB() {
  if (memoryDB) return memoryDB;

  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      memoryDB = JSON.parse(raw);
      return memoryDB;
    }
  } catch (err) {
    console.warn('Fallback to bundled default CMS data:', err.message);
  }

  // Clone default bundled data
  memoryDB = JSON.parse(JSON.stringify(defaultCMSData));
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(memoryDB, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Notice writing initial DB:', e.message);
  }

  return memoryDB;
}

export function saveDB(data) {
  memoryDB = data;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not write DB to disk:', e.message);
  }

  if (!isVercel) {
    syncStaticFiles(data);
  }
}

// Automatically syncs CMS database to frontend static modules (local/VPS mode)
export function syncStaticFiles(data) {
  try {
    // 1. Sync data/projects.js
    if (data.projects) {
      const projectsJsPath = path.join(ROOT_DIR, 'data', 'projects.js');
      const projectsClean = data.projects.map(p => {
        const copy = { ...p };
        delete copy.id;
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

import express from 'express';
import { getDB, saveDB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/content - All public content
router.get('/', (req, res) => {
  try {
    const db = getDB();
    res.json({
      success: true,
      siteSettings: db.siteSettings || {},
      branding: db.branding || {},
      navigation: db.navigation || [],
      categories: db.categories || [],
      heroContent: db.heroContent || {},
      metrics: db.metrics || {},
      spotlight: db.spotlight || {},
      socialLinks: db.socialLinks || {},
      footer: db.footer || {},
      clientsMarquee: db.clientsMarquee || [],
      clients: db.clients || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper for saving section
function updateSection(key, req, res) {
  try {
    const db = getDB();
    db[key] = Array.isArray(req.body) ? req.body : { ...db[key], ...req.body };
    saveDB(db);
    res.json({ success: true, message: `${key} updated successfully`, [key]: db[key] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Protected PUT routes
router.put('/branding', authenticateToken, (req, res) => updateSection('branding', req, res));
router.put('/navigation', authenticateToken, (req, res) => updateSection('navigation', req, res));
router.put('/categories', authenticateToken, (req, res) => updateSection('categories', req, res));
router.put('/site-settings', authenticateToken, (req, res) => updateSection('siteSettings', req, res));
router.put('/hero', authenticateToken, (req, res) => updateSection('heroContent', req, res));
router.put('/metrics', authenticateToken, (req, res) => updateSection('metrics', req, res));
router.put('/spotlight', authenticateToken, (req, res) => updateSection('spotlight', req, res));
router.put('/social-links', authenticateToken, (req, res) => updateSection('socialLinks', req, res));
router.put('/footer', authenticateToken, (req, res) => updateSection('footer', req, res));

export default router;

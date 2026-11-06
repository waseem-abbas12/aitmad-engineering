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
      heroContent: db.heroContent || {},
      metrics: db.metrics || {},
      clientsMarquee: db.clientsMarquee || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/content/site-settings (Protected)
router.put('/site-settings', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    db.siteSettings = {
      ...db.siteSettings,
      ...req.body
    };
    saveDB(db);
    res.json({ success: true, message: 'Site settings updated', siteSettings: db.siteSettings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/content/hero (Protected)
router.put('/hero', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    db.heroContent = {
      ...db.heroContent,
      ...req.body
    };
    saveDB(db);
    res.json({ success: true, message: 'Hero content updated', heroContent: db.heroContent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/content/metrics (Protected)
router.put('/metrics', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    db.metrics = {
      ...db.metrics,
      ...req.body
    };
    saveDB(db);
    res.json({ success: true, message: 'Metrics updated', metrics: db.metrics });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

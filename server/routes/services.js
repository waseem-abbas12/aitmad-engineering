import express from 'express';
import { getDB, saveDB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services
router.get('/', (req, res) => {
  try {
    const db = getDB();
    res.json({ success: true, services: db.services || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/services (Protected)
router.post('/', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const newService = req.body;

    if (!newService.title) {
      return res.status(400).json({ success: false, message: 'Service title is required' });
    }

    const id = `serv_${Date.now()}`;
    const baseSlug = (newService.slug || newService.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const service = {
      id,
      slug: baseSlug,
      title: newService.title,
      tagline: newService.tagline || '',
      icon: newService.icon || 'building',
      description: newService.description || '',
      fullDescription: newService.fullDescription || '',
      features: Array.isArray(newService.features) ? newService.features : [],
      benefits: Array.isArray(newService.benefits) ? newService.benefits : [],
      coverImage: newService.coverImage || 'assets/projects/project-2.webp'
    };

    db.services.push(service);
    saveDB(db);

    res.status(201).json({ success: true, message: 'Service created successfully', service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/services/:id (Protected)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.services.findIndex(s => s.id === id || s.slug === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const current = db.services[index];
    const update = req.body;

    db.services[index] = {
      ...current,
      ...update,
      id: current.id,
      features: Array.isArray(update.features) ? update.features : current.features,
      benefits: Array.isArray(update.benefits) ? update.benefits : current.benefits
    };

    saveDB(db);
    res.json({ success: true, message: 'Service updated successfully', service: db.services[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/services/:id (Protected)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.services.findIndex(s => s.id === id || s.slug === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const deleted = db.services.splice(index, 1)[0];
    saveDB(db);

    res.json({ success: true, message: 'Service deleted successfully', deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

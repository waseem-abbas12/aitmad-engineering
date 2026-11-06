import express from 'express';
import { getDB, saveDB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects - Public / Admin list
router.get('/', (req, res) => {
  try {
    const db = getDB();
    res.json({ success: true, projects: db.projects || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/projects/:idOrSlug
router.get('/:idOrSlug', (req, res) => {
  try {
    const db = getDB();
    const param = req.params.idOrSlug;
    const project = db.projects.find(p => p.id === param || p.slug === param);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects - Create project (Protected)
router.post('/', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const newProj = req.body;

    if (!newProj.title) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    // Generate unique slug if not provided
    const baseSlug = (newProj.slug || newProj.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (db.projects.some(p => p.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const id = `proj_${Date.now()}`;
    const project = {
      id,
      slug,
      title: newProj.title,
      category: newProj.category || 'Industrial',
      location: newProj.location || 'Punjab, Pakistan',
      area: newProj.area || '100,000 sq. ft.',
      span: newProj.span || '40 m Clear Span',
      eaveHeight: newProj.eaveHeight || '10.0 m',
      steelTonnage: newProj.steelTonnage || '500 Tons',
      year: Number(newProj.year) || new Date().getFullYear(),
      duration: newProj.duration || '6 Months',
      client: newProj.client || 'Corporate Client',
      scope: Array.isArray(newProj.scope) ? newProj.scope : (typeof newProj.scope === 'string' ? newProj.scope.split(',').map(s => s.trim()) : []),
      cover: newProj.cover || 'assets/projects/project-1-thumb.webp',
      gallery: Array.isArray(newProj.gallery) ? newProj.gallery : [newProj.cover || 'assets/projects/project-1.webp'],
      overview: newProj.overview || '',
      challenge: newProj.challenge || '',
      solution: newProj.solution || '',
      result: newProj.result || '',
      featured: Boolean(newProj.featured)
    };

    db.projects.unshift(project);
    saveDB(db);

    res.status(201).json({ success: true, message: 'Project created successfully', project });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id - Update project (Protected)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.projects.findIndex(p => p.id === id || p.slug === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const current = db.projects[index];
    const update = req.body;

    const updatedProject = {
      ...current,
      ...update,
      id: current.id, // Preserve id
      slug: update.slug ? update.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : current.slug,
      scope: Array.isArray(update.scope) ? update.scope : (typeof update.scope === 'string' ? update.scope.split(',').map(s => s.trim()) : current.scope),
      gallery: Array.isArray(update.gallery) ? update.gallery : current.gallery
    };

    db.projects[index] = updatedProject;
    saveDB(db);

    res.json({ success: true, message: 'Project updated successfully', project: updatedProject });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id - Delete project (Protected)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.projects.findIndex(p => p.id === id || p.slug === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const deleted = db.projects.splice(index, 1)[0];
    saveDB(db);

    res.json({ success: true, message: 'Project deleted successfully', deleted });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

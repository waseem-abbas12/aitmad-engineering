import express from 'express';
import { getDB, saveDB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/testimonials
router.get('/', (req, res) => {
  try {
    const db = getDB();
    res.json({ success: true, testimonials: db.testimonials || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/testimonials (Protected)
router.post('/', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const newTest = req.body;

    if (!newTest.quote || !newTest.author || !newTest.company) {
      return res.status(400).json({ success: false, message: 'Quote, author, and company are required' });
    }

    const nextId = db.testimonials.length > 0 ? Math.max(...db.testimonials.map(t => Number(t.id) || 0)) + 1 : 1;
    const authorInitials = newTest.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AE';

    const testimonial = {
      id: nextId,
      quote: newTest.quote,
      author: newTest.author,
      designation: newTest.designation || 'Director',
      company: newTest.company,
      location: newTest.location || 'Pakistan',
      rating: Number(newTest.rating) || 5,
      initials: newTest.initials || authorInitials
    };

    db.testimonials.push(testimonial);
    saveDB(db);

    res.status(201).json({ success: true, message: 'Testimonial added successfully', testimonial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/testimonials/:id (Protected)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.testimonials.findIndex(t => String(t.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const current = db.testimonials[index];
    const update = req.body;

    db.testimonials[index] = {
      ...current,
      ...update,
      id: current.id,
      rating: Number(update.rating) || current.rating
    };

    saveDB(db);
    res.json({ success: true, message: 'Testimonial updated successfully', testimonial: db.testimonials[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/testimonials/:id (Protected)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.testimonials.findIndex(t => String(t.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    const deleted = db.testimonials.splice(index, 1)[0];
    saveDB(db);

    res.json({ success: true, message: 'Testimonial deleted successfully', deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

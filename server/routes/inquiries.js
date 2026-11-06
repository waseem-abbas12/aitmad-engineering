import express from 'express';
import { getDB, saveDB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/inquiries - Public form submission (from contact/quote forms)
router.post('/', (req, res) => {
  try {
    const { name, phone, email, projectType, dimensions, location, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required' });
    }

    const db = getDB();
    if (!db.inquiries) db.inquiries = [];

    const newInquiry = {
      id: `inq_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      projectType: projectType || 'General Industrial',
      dimensions: dimensions || '',
      location: location || '',
      message: message || '',
      createdAt: new Date().toISOString(),
      status: 'new' // 'new', 'contacted', 'closed'
    };

    db.inquiries.unshift(newInquiry);
    saveDB(db);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been delivered directly to Aitmaad Engineering directors.',
      inquiryId: newInquiry.id
    });
  } catch (err) {
    console.error('Inquiry submission error:', err);
    res.status(500).json({ success: false, message: 'Failed to record inquiry' });
  }
});

// GET /api/inquiries - List all inquiries (Protected)
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    res.json({ success: true, inquiries: db.inquiries || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/inquiries/:id - Update status (Protected)
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.inquiries.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const { status } = req.body;
    db.inquiries[index].status = status || db.inquiries[index].status;
    saveDB(db);

    res.json({ success: true, message: 'Status updated', inquiry: db.inquiries[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/inquiries/:id (Protected)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.inquiries.findIndex(i => i.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    const deleted = db.inquiries.splice(index, 1)[0];
    saveDB(db);

    res.json({ success: true, message: 'Inquiry deleted', deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

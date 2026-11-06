import express from 'express';
import { getDB, saveDB } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/clients
router.get('/', (req, res) => {
  try {
    const db = getDB();
    res.json({ success: true, clients: db.clientsMarquee || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/clients (Protected)
router.post('/', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const { name, logo } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Client name is required' });
    }

    const newClient = {
      id: `c_${Date.now()}`,
      name: name.toUpperCase().trim(),
      logo: logo || ''
    };

    if (!db.clientsMarquee) db.clientsMarquee = [];
    db.clientsMarquee.push(newClient);
    saveDB(db);

    res.status(201).json({ success: true, message: 'Client added to marquee', client: newClient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/clients/:id (Protected)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.clientsMarquee.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const { name, logo } = req.body;
    db.clientsMarquee[index] = {
      ...db.clientsMarquee[index],
      name: name ? name.toUpperCase().trim() : db.clientsMarquee[index].name,
      logo: logo !== undefined ? logo : db.clientsMarquee[index].logo
    };

    saveDB(db);
    res.json({ success: true, message: 'Client updated', client: db.clientsMarquee[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/clients/:id (Protected)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const id = req.params.id;
    const index = db.clientsMarquee.findIndex(c => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }

    const deleted = db.clientsMarquee.splice(index, 1)[0];
    saveDB(db);

    res.json({ success: true, message: 'Client removed from marquee', deleted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const isVercel = Boolean(process.env.VERCEL);
const UPLOADS_DIR = isVercel ? path.join('/tmp', 'uploads') : path.join(ROOT_DIR, 'assets', 'uploads');

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Notice creating uploads directory:', e.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    cb(null, `${cleanBase}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (.jpg, .png, .webp, .svg, .gif) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

const router = express.Router();

// GET /api/media - List all uploaded media files
router.get('/', (req, res) => {
  try {
    const files = [];
    
    // Check uploads dir
    if (fs.existsSync(UPLOADS_DIR)) {
      const uploadFiles = fs.readdirSync(UPLOADS_DIR);
      uploadFiles.forEach(f => {
        const fullPath = path.join(UPLOADS_DIR, f);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          files.push({
            name: f,
            url: `assets/uploads/${f}`,
            size: stat.size,
            updatedAt: stat.mtime
          });
        }
      });
    }

    // Also include existing assets/projects/
    const projectsDir = path.join(ROOT_DIR, 'assets', 'projects');
    if (fs.existsSync(projectsDir)) {
      const projFiles = fs.readdirSync(projectsDir);
      projFiles.forEach(f => {
        const fullPath = path.join(projectsDir, f);
        const stat = fs.statSync(fullPath);
        if (stat.isFile() && !f.includes('-thumb')) {
          files.push({
            name: f,
            url: `assets/projects/${f}`,
            size: stat.size,
            updatedAt: stat.mtime
          });
        }
      });
    }

    files.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/media/upload (Protected)
router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const relativeUrl = `assets/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: relativeUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/media/:filename (Protected)
router.delete('/:filename', authenticateToken, (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const target = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
      return res.json({ success: true, message: 'File deleted' });
    }
    res.status(404).json({ success: false, message: 'File not found or cannot be deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

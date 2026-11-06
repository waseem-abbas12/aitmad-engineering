import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import servicesRoutes from './routes/services.js';
import testimonialsRoutes from './routes/testimonials.js';
import clientsRoutes from './routes/clients.js';
import contentRoutes from './routes/content.js';
import mediaRoutes from './routes/media.js';
import inquiriesRoutes from './routes/inquiries.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/inquiries', inquiriesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Aitmaad Engineering CMS Engine v1.0'
  });
});

// Serve static frontend files
app.use(express.static(ROOT_DIR));

// Fallback middleware (Express 5 compliant)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  if (req.path.startsWith('/admin')) {
    return res.sendFile(path.join(ROOT_DIR, 'admin', 'index.html'));
  }
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Aitmaad Engineering CMS Server Running on Port ${PORT}`);
  console.log(`🌐 Website URL:   http://localhost:${PORT}`);
  console.log(`🛠️ Admin Portal:  http://localhost:${PORT}/admin`);
  console.log(`======================================================\n`);
});

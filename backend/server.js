import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import heicConvert from 'heic-convert';

// Models
import User from './models/User.js';
import Stats from './models/Stats.js';
import GeneralSettings from './models/GeneralSettings.js';
import Achievement from './models/Achievement.js';
import Event from './models/Event.js';
import TeamMember from './models/TeamMember.js';
import GalleryItem from './models/GalleryItem.js';
import Alumni from './models/Alumni.js';
import Submission from './models/Submission.js';

// Initial clean states
const initialStats = {
  totalMembers: "0+",
  eventsConducted: "0+",
  yearsOfInnovation: "0+"
};

const initialGeneralSettings = {
  nextEventTitle: "",
  nextEventDate: "",
  mission: "",
  vision: "",
  aboutText: "IEDC AWH is a flagship initiative of Kerala Startup Mission (KSUM) — one of 550+ IEDCs across Kerala — providing students with access to cutting-edge technology, mentorship and early risk capital."
};

// Auth Middleware
import authMiddleware from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/iedc-awh';
const JWT_SECRET = process.env.JWT_SECRET || 'iedc-awh-super-secret-key-2026';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// Helper: map _id to id for client compatibility
const mapDoc = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id.toString();
  return obj;
};

const mapDocs = (docs) => docs.map(mapDoc);

// Robust helper to execute hard database delete matching ObjectId or String _id
const hardDelete = async (Model, id) => {
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Model.findByIdAndDelete(id);
    } else {
      await Model.collection.deleteOne({ _id: id });
    }
  } catch (error) {
    await Model.collection.deleteOne({ _id: id });
  }
};

// ============================================================================
// DATABASE CONNECTION & SEEDING
// ============================================================================
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    await seedDatabase();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });

async function seedDatabase() {
  try {
    // 1. Seed Default Admin User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        email: 'admin@iedcawh.org',
        password: hashedPassword
      });
      console.log('Seeded default admin user (admin@iedcawh.org / admin123).');
    }

    // 2. Seed Stats
    const statsCount = await Stats.countDocuments();
    if (statsCount === 0) {
      await Stats.create({
        _id: 'stats',
        ...initialStats
      });
      console.log('Seeded initial statistics.');
    }

    // 3. Seed General Settings
    const settingsCount = await GeneralSettings.countDocuments();
    if (settingsCount === 0) {
      await GeneralSettings.create({
        _id: 'general',
        ...initialGeneralSettings
      });
      console.log('Seeded initial general settings.');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// ============================================================================
// IMAGE UPLOAD ROUTE (MULTER)
// ============================================================================
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|heic|heif/;
    const mimetype = filetypes.test(file.mimetype) || /image\/heic|image\/heif/.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype || extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed.'));
  }
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    let buffer = req.file.buffer;
    let mimetype = req.file.mimetype;
    
    const isHeic = req.file.originalname.toLowerCase().endsWith('.heic') || 
                   req.file.originalname.toLowerCase().endsWith('.heif') || 
                   mimetype === 'image/heic' || 
                   mimetype === 'image/heif';
                   
    if (isHeic) {
      buffer = await heicConvert({
        buffer: req.file.buffer,
        format: 'JPEG',
        quality: 1
      });
      mimetype = 'image/jpeg';
    }
    
    const base64Data = buffer.toString('base64');
    const fileUrl = `data:${mimetype};base64,${base64Data}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: 'File upload failed.', error: error.message });
  }
});

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid administrator credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid administrator credentials.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        email: user.email,
        uid: user._id.toString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server login error.', error: error.message });
  }
});

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// Stats
app.get('/api/stats', async (req, res) => {
  try {
    let stats = await Stats.findById('stats');
    if (!stats) {
      stats = await Stats.create({ _id: 'stats', ...initialStats });
    }
    res.json(mapDoc(stats));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
});

// Achievements
app.get('/api/achievements', async (req, res) => {
  try {
    const list = await Achievement.find().sort({ createdAt: -1 });
    res.json(mapDocs(list));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch achievements.' });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const list = await Event.find().sort({ createdAt: -1 });
    res.json(mapDocs(list));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
});

// Team
app.get('/api/team', async (req, res) => {
  try {
    const list = await TeamMember.find();
    res.json(mapDocs(list));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team members.' });
  }
});

// Gallery
app.get('/api/gallery', async (req, res) => {
  try {
    const list = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(mapDocs(list));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch gallery items.' });
  }
});

// Alumni
app.get('/api/alumni', async (req, res) => {
  try {
    const list = await Alumni.find();
    res.json(mapDocs(list));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch alumni.' });
  }
});

// General Settings
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await GeneralSettings.findById('general');
    if (!settings) {
      settings = await GeneralSettings.create({ _id: 'general', ...initialGeneralSettings });
    }
    res.json(mapDoc(settings));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch general settings.' });
  }
});

// Add contact form submission (Public)
app.post('/api/submissions', async (req, res) => {
  try {
    const sub = new Submission(req.body);
    await sub.save();
    res.status(201).json(mapDoc(sub));
  } catch (error) {
    res.status(500).json({ message: 'Failed to create inquiry.', error: error.message });
  }
});

// ============================================================================
// SECURED ADMIN ROUTES
// ============================================================================

// Stats Update
app.post('/api/stats', authMiddleware, async (req, res) => {
  try {
    const updated = await Stats.findByIdAndUpdate('stats', req.body, { new: true, upsert: true });
    res.json(mapDoc(updated));
  } catch (error) {
    res.status(500).json({ message: 'Failed to update stats.' });
  }
});

// Settings Update
app.post('/api/settings', authMiddleware, async (req, res) => {
  try {
    const updated = await GeneralSettings.findByIdAndUpdate('general', req.body, { new: true, upsert: true });
    res.json(mapDoc(updated));
  } catch (error) {
    res.status(500).json({ message: 'Failed to update general settings.' });
  }
});

// Save Achievement (Create or Update)
app.post('/api/achievements', authMiddleware, async (req, res) => {
  try {
    const achData = req.body;
    let ach;
    if (achData.id) {
      const { id, ...updatePayload } = achData;
      ach = await Achievement.findByIdAndUpdate(id, updatePayload, { new: true });
    } else {
      ach = new Achievement(achData);
      await ach.save();
    }
    res.json(mapDoc(ach));
  } catch (error) {
    res.status(500).json({ message: 'Failed to save achievement.', error: error.message });
  }
});

// Delete Achievement
app.delete('/api/achievements/:id', authMiddleware, async (req, res) => {
  try {
    await hardDelete(Achievement, req.params.id);
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete achievement.' });
  }
});

// Save Event (Create or Update)
app.post('/api/events', authMiddleware, async (req, res) => {
  try {
    const eventData = req.body;
    let event;
    if (eventData.id) {
      const { id, ...updatePayload } = eventData;
      event = await Event.findByIdAndUpdate(id, updatePayload, { new: true });
    } else {
      event = new Event(eventData);
      await event.save();
    }
    res.json(mapDoc(event));
  } catch (error) {
    res.status(500).json({ message: 'Failed to save event.', error: error.message });
  }
});

// Delete Event
app.delete('/api/events/:id', authMiddleware, async (req, res) => {
  try {
    await hardDelete(Event, req.params.id);
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event.' });
  }
});

// Save Team Member (Create or Update)
app.post('/api/team', authMiddleware, async (req, res) => {
  try {
    const memberData = req.body;
    let member;
    if (memberData.id) {
      const { id, ...updatePayload } = memberData;
      member = await TeamMember.findByIdAndUpdate(id, updatePayload, { new: true });
    } else {
      member = new TeamMember(memberData);
      await member.save();
    }
    res.json(mapDoc(member));
  } catch (error) {
    res.status(500).json({ message: 'Failed to save team member.', error: error.message });
  }
});

// Delete Team Member
app.delete('/api/team/:id', authMiddleware, async (req, res) => {
  try {
    await hardDelete(TeamMember, req.params.id);
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete team member.' });
  }
});

// Save Gallery Item (Create or Update)
app.post('/api/gallery', authMiddleware, async (req, res) => {
  try {
    const itemData = req.body;
    let item;
    if (itemData.id) {
      const { id, ...updatePayload } = itemData;
      item = await GalleryItem.findByIdAndUpdate(id, updatePayload, { new: true });
    } else {
      item = new GalleryItem(itemData);
      await item.save();
    }
    res.json(mapDoc(item));
  } catch (error) {
    res.status(500).json({ message: 'Failed to save gallery item.', error: error.message });
  }
});

// Delete Gallery Item
app.delete('/api/gallery/:id', authMiddleware, async (req, res) => {
  try {
    await hardDelete(GalleryItem, req.params.id);
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete gallery item.' });
  }
});

// Save Alumni (Create or Update)
app.post('/api/alumni', authMiddleware, async (req, res) => {
  try {
    const alumniData = req.body;
    let alumni;
    if (alumniData.id) {
      const { id, ...updatePayload } = alumniData;
      alumni = await Alumni.findByIdAndUpdate(id, updatePayload, { new: true });
    } else {
      alumni = new Alumni(alumniData);
      await alumni.save();
    }
    res.json(mapDoc(alumni));
  } catch (error) {
    res.status(500).json({ message: 'Failed to save alumni.', error: error.message });
  }
});

// Delete Alumni
app.delete('/api/alumni/:id', authMiddleware, async (req, res) => {
  try {
    await hardDelete(Alumni, req.params.id);
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete alumni.' });
  }
});

// Get all Contact form submissions
app.get('/api/submissions', authMiddleware, async (req, res) => {
  try {
    const list = await Submission.find().sort({ timestamp: -1 });
    res.json(mapDocs(list));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact inquiries.' });
  }
});

// Mark submission as read/unread
app.put('/api/submissions/:id/read', authMiddleware, async (req, res) => {
  try {
    const { isRead } = req.body;
    const updated = await Submission.findByIdAndUpdate(
      req.params.id, 
      { isRead }, 
      { new: true }
    );
    res.json(mapDoc(updated));
  } catch (error) {
    res.status(500).json({ message: 'Failed to update read state.' });
  }
});

// Delete submission
app.delete('/api/submissions/:id', authMiddleware, async (req, res) => {
  try {
    await hardDelete(Submission, req.params.id);
    res.json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact inquiry.' });
  }
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

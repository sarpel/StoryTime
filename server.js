import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// Database setup
const dbPath = path.join(__dirname, 'storytime.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Settings table
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_gemini TEXT,
    api_gemini_model_id TEXT,
    api_elevenlabs TEXT,
    api_elevenlabs_model_id TEXT,
    api_elevenlabs_voice_id TEXT,
    voice_stability REAL,
    voice_similarity_boost REAL,
    generation_duration INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Stories table
  db.run(`CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    audio_url TEXT,
    audio_file_path TEXT,
    read_status BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create audio directory if it doesn't exist
  const audioDir = path.join(__dirname, 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }
});

// API Routes

// Save settings
app.post('/api/settings', (req, res) => {
  const settings = req.body;
  
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO settings (
      id, api_gemini, api_gemini_model_id, api_elevenlabs, 
      api_elevenlabs_model_id, api_elevenlabs_voice_id, 
      voice_stability, voice_similarity_boost, generation_duration, updated_at
    ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  
  stmt.run([
    settings.api.gemini,
    settings.api.gemini_model_id,
    settings.api.elevenlabs,
    settings.api.elevenlabs_model_id,
    settings.api.elevenlabs_voice_id,
    settings.voice.stability,
    settings.voice.similarity_boost,
    settings.generation.duration
  ], function(err) {
    if (err) {
      console.error('Settings save error:', err);
      res.status(500).json({ error: 'Ayarlar kaydedilemedi' });
    } else {
      res.json({ message: 'Ayarlar başarıyla kaydedildi', id: this.lastID });
    }
  });
  
  stmt.finalize();
});

// Get settings
app.get('/api/settings', (req, res) => {
  db.get('SELECT * FROM settings ORDER BY updated_at DESC LIMIT 1', (err, row) => {
    if (err) {
      console.error('Settings fetch error:', err);
      res.status(500).json({ error: 'Ayarlar alınamadı' });
    } else if (row) {
      const settings = {
        api: {
          gemini: row.api_gemini,
          gemini_model_id: row.api_gemini_model_id,
          elevenlabs: row.api_elevenlabs,
          elevenlabs_model_id: row.api_elevenlabs_model_id,
          elevenlabs_voice_id: row.api_elevenlabs_voice_id
        },
        voice: {
          stability: row.voice_stability,
          similarity_boost: row.voice_similarity_boost
        },
        generation: {
          duration: row.generation_duration
        }
      };
      res.json(settings);
    } else {
      res.json(null);
    }
  });
});

// Save story
app.post('/api/stories', (req, res) => {
  const { title, content, audioUrl, audioData } = req.body;
  
  let audioFilePath = null;
  
  // If audio data is provided, save it to file
  if (audioData) {
    const audioBuffer = Buffer.from(audioData, 'base64');
    const fileName = `story_${Date.now()}.mp3`;
    audioFilePath = path.join(__dirname, 'audio', fileName);
    
    try {
      fs.writeFileSync(audioFilePath, audioBuffer);
    } catch (err) {
      console.error('Audio file save error:', err);
      res.status(500).json({ error: 'Ses dosyası kaydedilemedi' });
      return;
    }
  }
  
  const stmt = db.prepare(`
    INSERT INTO stories (title, content, audio_url, audio_file_path, read_status)
    VALUES (?, ?, ?, ?, 0)
  `);
  
  stmt.run([title, content, audioUrl, audioFilePath], function(err) {
    if (err) {
      console.error('Story save error:', err);
      res.status(500).json({ error: 'Masal kaydedilemedi' });
    } else {
      res.json({ 
        message: 'Masal başarıyla kaydedildi', 
        id: this.lastID,
        story: {
          id: this.lastID,
          title,
          content,
          audioUrl,
          read: false,
          created_at: new Date().toISOString()
        }
      });
    }
  });
  
  stmt.finalize();
});

// Get all stories
app.get('/api/stories', (req, res) => {
  db.all('SELECT * FROM stories ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      console.error('Stories fetch error:', err);
      res.status(500).json({ error: 'Masallar alınamadı' });
    } else {
      const stories = rows.map(row => ({
        id: row.id,
        title: row.title,
        content: row.content,
        audioUrl: row.audio_url,
        read: Boolean(row.read_status),
        created_at: row.created_at
      }));
      res.json(stories);
    }
  });
});

// Update story (mark as read/unread)
app.put('/api/stories/:id', (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  
  db.run('UPDATE stories SET read_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
    [read ? 1 : 0, id], function(err) {
    if (err) {
      console.error('Story update error:', err);
      res.status(500).json({ error: 'Masal güncellenemedi' });
    } else {
      res.json({ message: 'Masal güncellendi' });
    }
  });
});

// Delete story
app.delete('/api/stories/:id', (req, res) => {
  const { id } = req.params;
  
  // First get the story to delete audio file if exists
  db.get('SELECT audio_file_path FROM stories WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Story fetch error:', err);
      res.status(500).json({ error: 'Masal alınamadı' });
      return;
    }
    
    // Delete audio file if exists
    if (row && row.audio_file_path && fs.existsSync(row.audio_file_path)) {
      try {
        fs.unlinkSync(row.audio_file_path);
      } catch (err) {
        console.error('Audio file delete error:', err);
      }
    }
    
    // Delete from database
    db.run('DELETE FROM stories WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Story delete error:', err);
        res.status(500).json({ error: 'Masal silinemedi' });
      } else {
        res.json({ message: 'Masal silindi' });
      }
    });
  });
});

// Serve audio files
app.get('/audio/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'audio', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Ses dosyası bulunamadı' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Sunucu hatası' });
});

// Start server
app.listen(PORT, () => {
  console.log(`StoryTime server running on port ${PORT}`);
  console.log(`Database: ${dbPath}`);
  console.log(`Audio directory: ${path.join(__dirname, 'audio')}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Database close error:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
}); 
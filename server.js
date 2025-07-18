import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

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

// Secure Gemini API endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    const { content, responseSchema, modelId } = req.body;
    
    console.log('=== Gemini API Request ===');
    console.log('Content:', content ? content.substring(0, 100) + '...' : 'No content');
    console.log('Model ID:', modelId);
    console.log('Response Schema:', !!responseSchema);
    
    // Check if API key is available in environment variables
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      console.log('❌ No Gemini API key in environment variables');
      return res.status(400).json({ error: 'Gemini API anahtarı eksik. Lütfen .env dosyasına geçerli bir API anahtarı ekleyin.' });
    }
    
    try {
      const modelName = modelId || 'gemini-1.5-flash';
      // Clean the model name - remove spaces and ensure it's a valid model ID
      const cleanModelName = modelName.replace(/\s+/g, '-').toLowerCase().replace('models/', '');
      
      console.log('Using model:', cleanModelName);
      console.log('API Key (first 10 chars):', GEMINI_API_KEY.substring(0, 10) + '...');
      
      // Make direct API call to Google's Gemini endpoint
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModelName}:generateContent?key=${GEMINI_API_KEY}`;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: content
              }
            ]
          }
        ]
      };
      
      console.log('📡 Making API call to:', apiUrl);
      console.log('📡 Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API response error:', response.status, errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ API call successful, response:', JSON.stringify(result, null, 2));
      
      // Extract text from the response
      let responseText = '';
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        const parts = result.candidates[0].content.parts;
        if (parts && parts.length > 0) {
          responseText = parts[0].text || '';
        }
      }
      
      if (!responseText) {
        throw new Error('No text content in API response');
      }
      
      console.log('✅ Extracted response text length:', responseText.length);
      
      if (responseSchema) {
        try {
          const jsonMatch = responseText.match(/\{.*\}/s);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return res.json(parsed);
          } else {
            const parsed = JSON.parse(responseText);
            return res.json(parsed);
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          if (responseSchema.properties && responseSchema.properties.title) {
            const lines = responseText.split('\n').filter(line => line.trim());
            const firstLine = lines[0]?.trim();
            if (firstLine && firstLine.length > 0) {
              return res.json({ title: firstLine });
            }
          }
          return res.json({ title: "Masal", story: responseText });
        }
      }
      
      res.json({ text: responseText });
    } catch (apiError) {
      console.error("Gemini API error:", apiError);
      if (apiError.message.includes('API key') || apiError.message.includes('API anahtarı') || apiError.message.includes('403')) {
        res.status(400).json({ error: 'Geçersiz Gemini API anahtarı. Lütfen .env dosyasındaki API anahtarını kontrol edin.' });
      } else if (apiError.message.includes('network') || apiError.message.includes('fetch')) {
        res.status(500).json({ error: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.' });
      } else {
        res.status(500).json({ error: `Gemini API hatası: ${apiError.message}` });
      }
    }
  } catch (error) {
    console.error('Gemini endpoint error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Secure ElevenLabs API endpoint
app.post('/api/elevenlabs', async (req, res) => {
  try {
    const { text, voiceId, modelId, stability, similarityBoost } = req.body;
    
    console.log('🔍 ElevenLabs TTS endpoint called');
    console.log('📝 Text length:', text ? text.length : 0);
    console.log('🎤 Voice ID:', voiceId);
    console.log('🤖 Model ID:', modelId);
    
    // Check if API key is available in environment variables
    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.trim() === '') {
      console.log('❌ No ElevenLabs API key found');
      return res.status(400).json({ error: 'ElevenLabs API anahtarı eksik. Lütfen .env dosyasına geçerli bir API anahtarı ekleyin.' });
    }
    
    console.log('🔑 ElevenLabs API key found (first 10 chars):', ELEVENLABS_API_KEY.substring(0, 10) + '...');
    
    try {
      const elevenlabs = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });
      
      console.log('📡 Calling ElevenLabs textToSpeech.convert()...');
      const audio = await elevenlabs.textToSpeech.convert(
        voiceId || '21m00Tcm4TlvDq8ikWAM', // Default voice ID
        {
          text: text,
          modelId: modelId || 'eleven_multilingual_v2',
          outputFormat: 'mp3_44100_128',
          voice_settings: {
            stability: stability || 0.6,
            similarity_boost: similarityBoost || 0.7
          }
        }
      );
      
      console.log('✅ ElevenLabs TTS response received');
      console.log('🎵 Audio type:', typeof audio);
      console.log('🎵 Audio constructor:', audio.constructor.name);
        
      // Convert audio to base64 for transmission
      let audioData;
      if (audio instanceof ArrayBuffer) {
        audioData = new Uint8Array(audio);
      } else if (audio instanceof Uint8Array) {
        audioData = audio;
      } else if (audio && typeof audio === 'object' && audio.buffer) {
        audioData = new Uint8Array(audio.buffer);
      } else {
        audioData = new Uint8Array(audio);
      }
      
      console.log('🎵 Audio data length:', audioData.length);
      
      const base64Audio = Buffer.from(audioData).toString('base64');
      console.log('🎵 Base64 audio length:', base64Audio.length);
      
      res.json({ audio: base64Audio, mimeType: 'audio/mpeg' });
    } catch (apiError) {
      console.error("❌ ElevenLabs API error:", apiError);
      if (apiError.message.includes('API key') || apiError.message.includes('API anahtarı') || apiError.message.includes('401')) {
        res.status(400).json({ error: 'Geçersiz ElevenLabs API anahtarı. Lütfen .env dosyasındaki API anahtarını kontrol edin.' });
      } else if (apiError.message.includes('network') || apiError.message.includes('fetch')) {
        res.status(500).json({ error: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.' });
      } else {
        res.status(500).json({ error: `ElevenLabs API hatası: ${apiError.message}` });
      }
    }
  } catch (error) {
    console.error('❌ ElevenLabs endpoint error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Fetch ElevenLabs voices
app.post('/api/elevenlabs/voices', async (req, res) => {
  console.log('🔍 ElevenLabs voices endpoint called');
  try {
    // Check if API key is available in environment variables
    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.trim() === '') {
      console.log('❌ No ElevenLabs API key found');
      return res.status(400).json({ error: 'ElevenLabs API anahtarı eksik. Lütfen .env dosyasına geçerli bir API anahtarı ekleyin.' });
    }
    
    console.log('🔑 ElevenLabs API key found (first 10 chars):', ELEVENLABS_API_KEY.substring(0, 10) + '...');
    
    try {
      const elevenlabs = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });
      console.log('📡 Calling ElevenLabs voices.getAll()...');
      const voices = await elevenlabs.voices.getAll();
      console.log('✅ ElevenLabs voices response:', voices);
      console.log('📊 Voices count:', voices.length);
      if (voices.length > 0) {
        console.log('🎤 First voice:', voices[0]);
      }
      
      // Return voices wrapped in an object to match frontend expectations
      res.json({ voices });
    } catch (apiError) {
      console.error("❌ ElevenLabs voices API error:", apiError);
      if (apiError.message.includes('API key') || apiError.message.includes('401')) {
        res.status(400).json({ error: 'Geçersiz ElevenLabs API anahtarı. Lütfen .env dosyasındaki API anahtarını kontrol edin.' });
      } else {
        res.status(500).json({ error: `ElevenLabs API hatası: ${apiError.message}` });
      }
    }
  } catch (error) {
    console.error('❌ ElevenLabs voices endpoint error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Fetch ElevenLabs models
app.post('/api/elevenlabs/models', async (req, res) => {
  console.log('🔍 ElevenLabs models endpoint called');
  try {
    // Check if API key is available in environment variables
    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY.trim() === '') {
      console.log('❌ No ElevenLabs API key found');
      return res.status(400).json({ error: 'ElevenLabs API anahtarı eksik. Lütfen .env dosyasına geçerli bir API anahtarı ekleyin.' });
    }
    
    console.log('🔑 ElevenLabs API key found (first 10 chars):', ELEVENLABS_API_KEY.substring(0, 10) + '...');
    
    try {
      const elevenlabs = new ElevenLabsClient({ apiKey: ELEVENLABS_API_KEY });
      console.log('📡 Calling ElevenLabs models.list()...');
      const models = await elevenlabs.models.list();
      console.log('✅ ElevenLabs models response:', models);
      console.log('📊 Models count:', models.length);
      if (models.length > 0) {
        console.log('🎯 First model:', models[0]);
      }
      
      res.json({ models });
    } catch (apiError) {
      console.error("❌ ElevenLabs models API error:", apiError);
      if (apiError.message.includes('API key') || apiError.message.includes('401')) {
        res.status(400).json({ error: 'Geçersiz ElevenLabs API anahtarı. Lütfen .env dosyasındaki API anahtarını kontrol edin.' });
      } else {
        res.status(500).json({ error: `ElevenLabs API hatası: ${apiError.message}` });
      }
    }
  } catch (error) {
    console.error('❌ ElevenLabs models endpoint error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Fetch Gemini models
app.post('/api/gemini/models', async (req, res) => {
  console.log('🔍 Gemini models endpoint called');
  try {
    // Check if API key is available in environment variables
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      console.log('❌ No Gemini API key in environment variables');
      return res.status(400).json({ error: 'Gemini API anahtarı eksik. Lütfen .env dosyasına geçerli bir API anahtarı ekleyin.' });
    }
    
    try {
      // Make direct API call to Google's Gemini models endpoint
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
      
      console.log('📡 Making API call to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API response error:', response.status, errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ API call successful, response:', JSON.stringify(result, null, 2));
      
      // Filter and format models
      let models = [];
      if (result.models && Array.isArray(result.models)) {
        models = result.models
          .filter(model => model.name && model.name.includes('gemini'))
          .map(model => ({
            name: model.name,
            displayName: model.displayName || model.name.replace('models/', ''),
            description: model.description || '',
            supportedGenerationMethods: model.supportedGenerationMethods || []
          }));
      }
      
      console.log('✅ Filtered Gemini models:', models);
      res.json({ models });
    } catch (apiError) {
      console.error("❌ Gemini models API error:", apiError);
      if (apiError.message.includes('API key') || apiError.message.includes('403')) {
        res.status(400).json({ error: 'Geçersiz Gemini API anahtarı. Lütfen .env dosyasındaki API anahtarını kontrol edin.' });
      } else {
        res.status(500).json({ error: `Gemini API hatası: ${apiError.message}` });
      }
    }
  } catch (error) {
    console.error('❌ Models endpoint error:', error);
    res.status(500).json({ error: 'Server error' });
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
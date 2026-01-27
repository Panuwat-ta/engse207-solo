const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// ============================================
// 📌 VERSION 1: In-Memory Storage
// ============================================
// ตอนนี้เก็บ notes ไว้ใน memory (array)
// ปัญหา: restart server = ข้อมูลหาย!

let notes = [
    { id: 1, title: 'Note แรก', content: 'เรียนรู้ Docker', createdAt: new Date().toISOString() },
    { id: 2, title: 'Note ที่สอง', content: 'ฝึกเขียน Dockerfile', createdAt: new Date().toISOString() }
];
let nextId = 3;

// ============================================
// Routes
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        storage: 'in-memory'
    });
});

// GET /api/notes - ดู notes ทั้งหมด
app.get('/api/notes', (req, res) => {
    console.log(`📋 GET /api/notes - Found ${notes.length} notes`);
    res.json({
        success: true,
        data: notes,
        count: notes.length
    });
});

// POST /api/notes - เพิ่ม note ใหม่
app.post('/api/notes', (req, res) => {
    const { title, content } = req.body;
    
    // Validation
    if (!title || !content) {
        return res.status(400).json({
            success: false,
            error: 'กรุณาระบุ title และ content'
        });
    }
    
    const newNote = {
        id: nextId++,
        title,
        content,
        createdAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    console.log(`✅ POST /api/notes - Created note #${newNote.id}: ${title}`);
    
    res.status(201).json({
        success: true,
        data: newNote,
        message: 'สร้าง note สำเร็จ'
    });
});

// DELETE /api/notes/:id - ลบ note
app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = notes.findIndex(n => n.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: `ไม่พบ note #${id}`
        });
    }
    
    const deleted = notes.splice(index, 1)[0];
    console.log(`🗑️ DELETE /api/notes/${id} - Deleted: ${deleted.title}`);
    
    res.json({
        success: true,
        message: `ลบ note #${id} สำเร็จ`
    });
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║        📝 Simple Note App - Docker Workshop        ║');
    console.log('╠════════════════════════════════════════════════════╣');
    console.log(`║  🚀 Server running on port ${PORT}                 ║`);
    console.log(`║  📊 Storage: In-Memory (${notes.length} notes)     ║`);
    console.log('║  📍 Endpoints:                                     ║');
    console.log('║     GET  /health      - Health check               ║');
    console.log('║     GET  /api/notes   - List all notes             ║');
    console.log('║     POST /api/notes   - Create new note            ║');
    console.log('║     DELETE /api/notes/:id - Delete note            ║');
    console.log('╚════════════════════════════════════════════════════╝');
    console.log('');
});
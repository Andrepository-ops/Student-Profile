require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('Missing JWT_SECRET in .env — copy .env.example to .env and fill it in.');
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' })); // generous limit since photos are sent as base64

const db = new Database(path.join(__dirname, 'studentprofile.db'));

// --- Schema ---
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS profiles (
    student_id TEXT PRIMARY KEY,
    name TEXT,
    course TEXT,
    year TEXT,
    about TEXT,
    skills TEXT,
    photo TEXT,
    FOREIGN KEY (student_id) REFERENCES users(student_id)
);
`);

// --- Auth middleware ---
function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const token = header.slice(7);
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.studentId = payload.studentId;
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }
}

// --- Login ---
app.post('/api/login', (req, res) => {
    const { studentId, password } = req.body;
    if (!studentId || !password) {
        return res.status(400).json({ error: 'Student ID and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE student_id = ?').get(studentId);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid student ID or password.' });
    }

    const token = jwt.sign({ studentId: user.student_id }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
});

// --- Read profile ---
app.get('/api/profile', authMiddleware, (req, res) => {
    const profile = db.prepare('SELECT * FROM profiles WHERE student_id = ?').get(req.studentId);
    if (!profile) {
        return res.status(404).json({ error: 'Unable to retrieve your profile. Please try again.' });
    }
    res.json(profile);
});

// --- Create/Update profile (upsert) ---
app.put('/api/profile', authMiddleware, (req, res) => {
    const { name, course, year, about, skills, photo } = req.body;
    if (!name || !course || !year || !about) {
        return res.status(400).json({ error: 'Please complete all required fields.' });
    }

    try {
        const existing = db.prepare('SELECT * FROM profiles WHERE student_id = ?').get(req.studentId);

        if (existing) {
            db.prepare(
                `UPDATE profiles SET name = ?, course = ?, year = ?, about = ?, skills = ?, photo = COALESCE(?, photo)
                 WHERE student_id = ?`
            ).run(name, course, year, about, skills, photo || null, req.studentId);
        } else {
            db.prepare(
                `INSERT INTO profiles (student_id, name, course, year, about, skills, photo)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`
            ).run(req.studentId, name, course, year, about, skills, photo || null);
        }

        const updated = db.prepare('SELECT * FROM profiles WHERE student_id = ?').get(req.studentId);
        res.json({ message: 'Profile updated successfully', profile: updated });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Unable to update your profile.' });
    }
});

// --- Delete (demonstration only — deletes a designated test record, never a real logged-in user) ---
app.delete('/api/profile/test-record', authMiddleware, (req, res) => {
    db.prepare('DELETE FROM profiles WHERE student_id = ?').run('TEST-0000');
    db.prepare('DELETE FROM users WHERE student_id = ?').run('TEST-0000');
    res.json({ message: 'Test record deleted.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

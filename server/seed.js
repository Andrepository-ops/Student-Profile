require('dotenv').config();
const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'studentprofile.db'));

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

function createAccount(studentId, plainPassword, profile) {
    const hash = bcrypt.hashSync(plainPassword, 10);
    db.prepare('INSERT OR IGNORE INTO users (student_id, password_hash) VALUES (?, ?)').run(studentId, hash);
    db.prepare(
        `INSERT OR IGNORE INTO profiles (student_id, name, course, year, about, skills)
         VALUES (?, ?, ?, ?, ?, ?)`
    ).run(studentId, profile.name, profile.course, profile.year, profile.about, profile.skills);
    console.log(`Created account: ${studentId} / ${plainPassword} - seed.js:33`);
}

// Demo account — safe to list in your README's "Test Accounts" section
createAccount('TEST-0001', 'Test1234!', {
    name: 'Test Student',
    course: 'BS Information Technology',
    year: '3rd Year',
    about: 'This is a demo account created for grading.',
    skills: 'HTML, CSS, JavaScript'
});

// Separate throwaway record, only used to demonstrate the Delete operation
createAccount('TEST-0000', 'DeleteMe1234!', {
    name: 'Deletable Test Record',
    course: 'N/A',
    year: 'N/A',
    about: 'This record exists only to demonstrate DELETE.',
    skills: 'N/A'
});

console.log('Seed complete. - seed.js:54');
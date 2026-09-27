// auth.js - shared authentication helpers, included on every page

// Point this at wherever your backend actually runs.
// In a desktop browser during development, localhost is fine.
// On a real device/emulator, localhost means the DEVICE, not your computer —
// replace this with your computer's LAN IP, e.g. 'http://192.168.1.20:3000'
const API_BASE = 'http://localhost:3000';

function getToken() {
    return localStorage.getItem('authToken');
}

function setToken(token) {
    localStorage.setItem('authToken', token);
}

function clearToken() {
    localStorage.removeItem('authToken');
}

// Call at the top of any page that requires login
function requireAuth() {
    if (!getToken()) {
        window.location.href = 'login.html';
    }
}

function logout() {
    clearToken();
    window.location.href = 'login.html';
}

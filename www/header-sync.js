// header-sync.js - keeps the header (name/course/year/photo) in sync on
// about.html, skills.html, projects.html, and contact.html

document.addEventListener('DOMContentLoaded', async () => {
    requireAuth(); // defined in auth.js — redirects to login.html if not authenticated
    if (!getToken()) return;

    try {
        const res = await fetch(`${API_BASE}/api/profile`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });

        if (res.status === 401) {
            clearToken();
            window.location.href = 'login.html';
            return;
        }
        if (!res.ok) return;

        const profile = await res.json();

        const headerName = document.getElementById('header-name');
        const headerCourse = document.getElementById('header-course');
        const headerYear = document.getElementById('header-year');
        if (headerName) headerName.textContent = profile.name;
        if (headerCourse) headerCourse.textContent = profile.course;
        if (headerYear) headerYear.textContent = profile.year;

        if (profile.photo) {
            const photoEl = document.getElementById('profile-photo');
            if (photoEl) photoEl.src = profile.photo;
        }
    } catch (err) {
        console.error('Could not load profile for header:', err);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

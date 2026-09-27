const STORAGE_KEY = 'studentProfile';
const PHOTO_KEY = 'profilePhoto';

const defaults = {
    name: 'Your Name',
    course: 'BS Information Technology',
    year: '4th Year',
    about: 'Write something about yourself.',
    skills: 'HTML, CSS, JavaScript'
};

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const profile = saved ? JSON.parse(saved) : defaults;

    const headerName = document.getElementById('header-name');
    const headerCourse = document.getElementById('header-course');
    const headerYear = document.getElementById('header-year');

    if (headerName) headerName.textContent = profile.name;
    if (headerCourse) headerCourse.textContent = profile.course;
    if (headerYear) headerYear.textContent = profile.year;

    const savedPhoto = localStorage.getItem(PHOTO_KEY);
    if (savedPhoto) {
        const photoEl = document.getElementById('profile-photo');
        if (photoEl) photoEl.src = savedPhoto;
    }
});

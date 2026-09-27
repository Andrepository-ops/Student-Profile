
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova - index.js:5' + cordova.platformId + '@' + cordova.version);
    const readyEl = document.getElementById('deviceready');
    if (readyEl) {
        readyEl.classList.add('ready');
    }
}

const STORAGE_KEY = 'studentProfile';

const defaults = {
    name: 'Your Name',
    course: 'BS Information Technology',
    year: '4th Year',
    about: 'Write something about yourself.',
    skills: 'HTML, CSS, JavaScript'
};

function loadProfile() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaults;
}

function renderProfile(profile) {
    
    document.getElementById('view-name').textContent = profile.name;
    document.getElementById('view-course').textContent = profile.course;
    document.getElementById('view-year').textContent = profile.year;
    document.getElementById('view-about').textContent = profile.about;
    document.getElementById('view-skills').textContent = profile.skills;

    
    const headerName = document.getElementById('header-name');
    const headerCourse = document.getElementById('header-course');
    const headerYear = document.getElementById('header-year');
    if (headerName) headerName.textContent = profile.name;
    if (headerCourse) headerCourse.textContent = profile.course;
    if (headerYear) headerYear.textContent = profile.year;
}

function fillForm(profile) {
    document.getElementById('input-name').value = profile.name;
    document.getElementById('input-course').value = profile.course;
    document.getElementById('input-year').value = profile.year;
    document.getElementById('input-about').value = profile.about;
    document.getElementById('input-skills').value = profile.skills;
}

document.addEventListener('DOMContentLoaded', () => {
    let profile = loadProfile();
    renderProfile(profile);

    const viewSection = document.getElementById('profile-view');
    const editSection = document.getElementById('profile-edit');
    const errorEl = document.getElementById('form-error');

    document.getElementById('edit-btn').addEventListener('click', () => {
        fillForm(profile);
        errorEl.classList.add('d-none');
        viewSection.classList.add('d-none');
        editSection.classList.remove('d-none');
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
        editSection.classList.add('d-none');
        viewSection.classList.remove('d-none');
    });

    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('input-name').value.trim();
        const course = document.getElementById('input-course').value.trim();
        const year = document.getElementById('input-year').value.trim();
        const about = document.getElementById('input-about').value.trim();
        const skills = document.getElementById('input-skills').value.trim();

        if (!name || !course || !year || !about) {
            errorEl.textContent = 'Please complete all required fields.';
            errorEl.classList.remove('d-none');
            return;
        }

        profile = { name, course, year, about, skills };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        renderProfile(profile);

        editSection.classList.add('d-none');
        viewSection.classList.remove('d-none');
    });
});

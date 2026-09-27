document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova - index.js:4' + cordova.platformId + '@' + cordova.version);
    const readyEl = document.getElementById('deviceready');
    if (readyEl) {
        readyEl.classList.add('ready');
    }
}

const STORAGE_KEY = 'studentProfile';
const PHOTO_KEY = 'profilePhoto';

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



function loadSavedPhoto() {
    const savedPhoto = localStorage.getItem(PHOTO_KEY);
    if (savedPhoto) {
        const photoEl = document.getElementById('profile-photo');
        if (photoEl) photoEl.src = savedPhoto;
    }
}

function capturePhoto() {
    if (!navigator.camera) {
        alert('Camera is not available. Please run this app on a device or emulator with Cordova camera support.');
        return;
    }

    navigator.camera.getPicture(onCaptureSuccess, onCaptureError, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true,
        targetWidth: 500,
        targetHeight: 500
    });
}

function onCaptureSuccess(imageData) {
    // TEMPORARY DIAGNOSTIC - remove this alert once the issue is found
    const preview = imageData ? imageData.substring(0, 40) : '(empty/null)';
    const length = imageData ? imageData.length : 0;
    alert('DEBUG - length: ' + length + '\nstarts with: ' + preview);

    if (!imageData || imageData.length < 100) {
        alert('The camera returned no usable image data. This usually means a storage/media permission was denied on the device.');
        return;
    }

    // If the plugin already included the data: prefix, don't double it up
    const dataUri = imageData.indexOf('data:image') === 0
        ? imageData
        : 'data:image/jpeg;base64,' + imageData;

    const photoEl = document.getElementById('profile-photo');
    if (photoEl) photoEl.src = dataUri;

    try {
        localStorage.setItem(PHOTO_KEY, dataUri);
    } catch (e) {
        console.error('Could not save photo to localStorage - index.js: ' + e);
        alert('Photo captured, but it was too large to save permanently. It will disappear after you close the app.');
    }
}

function onCaptureError(message) {
    // Cordova reports cancellation as an error message containing "cancel"
    if (typeof message === 'string' && message.toLowerCase().includes('cancel')) {
        // User cancelled - do nothing, keep existing picture
        return;
    }
    alert('Unable to access the camera. Please check your device permissions.');
    console.error('Camera error: - index.js:89' + message);
}



document.addEventListener('DOMContentLoaded', () => {
    // Profile view/edit setup
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

    
    loadSavedPhoto();
    const changeBtn = document.getElementById('change-photo-btn');
    if (changeBtn) {
        changeBtn.addEventListener('click', capturePhoto);
    }
});
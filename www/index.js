document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova - index.js:4' + cordova.platformId + '@' + cordova.version);
    const readyEl = document.getElementById('deviceready');
    if (readyEl) {
        readyEl.classList.add('ready');
    }
}

let profile = null;

async function loadProfile() {
    const res = await fetch(`${API_BASE}/api/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (res.status === 401) {
        clearToken();
        window.location.href = 'login.html';
        return null;
    }
    if (!res.ok) {
        alert('Unable to retrieve your profile. Please try again.');
        return null;
    }
    return res.json();
}

async function saveProfile(updated) {
    const res = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(updated)
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Unable to update your profile.');
    }
    return data.profile;
}

function renderProfile(p) {
    document.getElementById('view-name').textContent = p.name;
    document.getElementById('view-course').textContent = p.course;
    document.getElementById('view-year').textContent = p.year;
    document.getElementById('view-about').textContent = p.about;
    document.getElementById('view-skills').textContent = p.skills;

    const headerName = document.getElementById('header-name');
    const headerCourse = document.getElementById('header-course');
    const headerYear = document.getElementById('header-year');
    if (headerName) headerName.textContent = p.name;
    if (headerCourse) headerCourse.textContent = p.course;
    if (headerYear) headerYear.textContent = p.year;

    if (p.photo) {
        const photoEl = document.getElementById('profile-photo');
        if (photoEl) photoEl.src = p.photo;
    }
}

function fillForm(p) {
    document.getElementById('input-name').value = p.name;
    document.getElementById('input-course').value = p.course;
    document.getElementById('input-year').value = p.year;
    document.getElementById('input-about').value = p.about;
    document.getElementById('input-skills').value = p.skills;
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
    if (!imageData || imageData.length < 100) {
        alert('The camera returned no usable image data. This usually means a storage/media permission was denied on the device.');
        return;
    }

    const dataUri = imageData.indexOf('data:image') === 0
        ? imageData
        : 'data:image/jpeg;base64,' + imageData;

    const photoEl = document.getElementById('profile-photo');
    if (photoEl) photoEl.src = dataUri;

    // Save the new photo to the database right away, merged with the current profile fields
    saveProfile({ ...profile, photo: dataUri })
        .then((updated) => {
            profile = updated;
        })
        .catch((err) => {
            alert(err.message);
        });
}

function onCaptureError(message) {
    // Cordova reports cancellation as an error message containing "cancel"
    if (typeof message === 'string' && message.toLowerCase().includes('cancel')) {
        return;
    }
    alert('Unable to access the camera. Please check your device permissions.');
    console.error('Camera error: - index.js:89' + message);
}

document.addEventListener('DOMContentLoaded', async () => {
    requireAuth(); // defined in auth.js — redirects to login.html if not authenticated
    if (!getToken()) return;

    profile = await loadProfile();
    if (!profile) return;
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

    document.getElementById('edit-form').addEventListener('submit', async (e) => {
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

        try {
            profile = await saveProfile({ name, course, year, about, skills });
            renderProfile(profile);
            editSection.classList.add('d-none');
            viewSection.classList.remove('d-none');
            alert('Profile updated successfully');
        } catch (err) {
            errorEl.textContent = err.message;
            errorEl.classList.remove('d-none');
        }
    });

    const changeBtn = document.getElementById('change-photo-btn');
    if (changeBtn) {
        changeBtn.addEventListener('click', capturePhoto);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

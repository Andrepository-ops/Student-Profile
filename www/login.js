document.addEventListener('DOMContentLoaded', () => {
    // Already logged in? Skip straight to the profile.
    if (getToken()) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('login-form');
    const errorEl = document.getElementById('login-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.classList.add('d-none');

        const studentId = document.getElementById('input-student-id').value.trim();
        const password = document.getElementById('input-password').value;

        if (!studentId || !password) {
            errorEl.textContent = 'Please enter both your student ID and password.';
            errorEl.classList.remove('d-none');
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, password })
            });
            const data = await res.json();

            if (!res.ok) {
                errorEl.textContent = data.error || 'Invalid student ID or password.';
                errorEl.classList.remove('d-none');
                return;
            }

            setToken(data.token);
            window.location.href = 'index.html';
        } catch (err) {
            console.error(err);
            errorEl.textContent = 'Unable to reach the server. Please try again.';
            errorEl.classList.remove('d-none');
        }
    });
});

/* ============================================
   AUTH MODULE - Simple Authentication
   Inventory Control System AAA
   ============================================ */

const Auth = (() => {
    const CREDENTIALS = { admin: 'admin123' };

    function init() {
        const form = document.getElementById('auth-form');
        const authScreen = document.getElementById('auth-screen');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = document.getElementById('auth-user').value.trim();
                const pass = document.getElementById('auth-pass').value;
                const errorEl = document.getElementById('auth-error');

                if (CREDENTIALS[user] && CREDENTIALS[user] === pass) {
                    localStorage.setItem('ics_authenticated', 'true');
                    localStorage.setItem('ics_user', user);
                    errorEl.classList.add('hidden');
                    showApp();
                } else {
                    errorEl.textContent = 'Usuario o contrasena incorrectos';
                    errorEl.classList.remove('hidden');
                    document.getElementById('auth-pass').value = '';
                    document.getElementById('auth-pass').focus();
                }
            });
        }

        // Check if already authenticated
        if (localStorage.getItem('ics_authenticated') === 'true') {
            showApp();
        }
    }

    function showApp() {
        const authScreen = document.getElementById('auth-screen');
        const app = document.getElementById('app');

        if (authScreen) {
            authScreen.style.opacity = '0';
            setTimeout(() => {
                authScreen.classList.add('hidden');
                app.classList.remove('hidden');
                app.style.opacity = '0';
                requestAnimationFrame(() => {
                    app.style.transition = 'opacity 0.4s ease';
                    app.style.opacity = '1';
                    if (typeof App !== 'undefined' && App.init) App.init();
                });
            }, 300);
        }
    }

    function logout() {
        localStorage.removeItem('ics_authenticated');
        localStorage.removeItem('ics_user');
        location.reload();
    }

    function isAuthenticated() {
        return localStorage.getItem('ics_authenticated') === 'true';
    }

    function getUser() {
        return localStorage.getItem('ics_user') || 'Admin';
    }

    return { init, logout, isAuthenticated, getUser };
})();
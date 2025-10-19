document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('card');
    const toSignup = document.getElementById('toSignup');
    const toLogin = document.getElementById('toLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (!card || !toSignup || !toLogin || !loginForm || !signupForm) {
        console.error('Login page elements missing:', { card, toSignup, toLogin, loginForm, signupForm });
        alert('Error: Login page setup failed. Please check console for details.');
        return;
    }

    toSignup.addEventListener('click', () => {
        card.classList.add('flip');
    });

    toLogin.addEventListener('click', () => {
        card.classList.remove('flip');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.getElementById('loginRole').value;
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!role || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Simulate login (replace with actual authentication)
        localStorage.setItem('userRole', role);
        window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.getElementById('signupRole').value;
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        if (!role || !name || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Simulate signup (replace with actual registration)
        localStorage.setItem('userRole', role);
        window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
    });

    document.getElementById('forgotLink').addEventListener('click', () => {
        alert('Forgot Password functionality is not implemented yet.');
    });
});
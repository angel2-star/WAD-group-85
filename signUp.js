document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userType = document.getElementById('userType').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const full_name = document.getElementById('full_name').value;
            const email = document.getElementById('email').value;
            
            console.log('Registration attempt:', { username, userType });
            
            // Validate role selection
            if (!userType) {
                alert('Please select your role');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        username, 
                        password, 
                        userType, 
                        full_name, 
                        email 
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    alert('Registration successful! Please login with your new account.');
                    window.location.href = 'Login.html';
                } else {
                    alert(data.error || 'Registration failed');
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed - cannot connect to server');
            }
        });
    }
    
    // Add navigation back to login
    const toLoginLink = document.getElementById('toLogin');
    if (toLoginLink) {
        toLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'Login.html';
        });
    }
});
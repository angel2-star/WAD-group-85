const studentBtn = document.getElementById('student-btn');
const adminBtn = document.getElementById('admin-btn');
const loginForm = document.getElementById('login-form');
const userLabel = document.getElementById('user-label');
const userInput = document.getElementById('user-input');
const passLabel = document.getElementById('pass-label');
const passInput = document.getElementById('pass-input');

function activateStudent() {
  loginForm.action = 'student-login.php';
  userLabel.textContent = 'Student ID:';
  userInput.placeholder = 'Enter your student ID';
  userInput.name = 'student_id';
  passLabel.textContent = 'Password:';
  passInput.placeholder = 'Enter your password';
  adminBtn.classList.remove('active');
  studentBtn.classList.add('active');
}

function activateAdmin() {
  loginForm.action = 'admin-login.php';
  userLabel.textContent = 'Admin Username:';
  userInput.placeholder = 'Enter your admin username';
  userInput.name = 'admin_username';
  passLabel.textContent = 'Password:';
  passInput.placeholder = 'Enter your password';
  adminBtn.classList.add('active');
  studentBtn.classList.remove('active');
}

// Event listeners for toggle buttons
studentBtn.addEventListener('click', activateStudent);
adminBtn.addEventListener('click', activateAdmin);
/// this is just so that when you press the admin/ student login buttons on the home page it takes you to the correct toggle on the login page
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

window.addEventListener('DOMContentLoaded', () => {
  const loginType = getQueryParam('type');
  if (loginType === 'admin') {
    activateAdmin();
  } else {
    activateStudent(); // Default to student if no or unknown param
  }
});

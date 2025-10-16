// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded successfully!');
    
    // Set initial data
    loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Role switching
    document.getElementById('student-role-btn').addEventListener('click', function() {
        switchRole('student');
    });
    
    document.getElementById('admin-role-btn').addEventListener('click', function() {
        switchRole('admin');
    });

    // Button actions
    document.getElementById('refresh-btn').addEventListener('click', refreshDashboard);
    document.getElementById('export-btn').addEventListener('click', exportTimetable);
    document.getElementById('view-all-classes').addEventListener('click', viewAllClasses);
    document.getElementById('clear-notifications').addEventListener('click', clearNotifications);
    document.getElementById('search-classes').addEventListener('click', searchClasses);
    document.getElementById('print-timetable').addEventListener('click', printTimetable);
    document.getElementById('view-profile').addEventListener('click', viewProfile);
    document.getElementById('manage-courses').addEventListener('click', manageCourses);
    document.getElementById('add-schedule').addEventListener('click', addSchedule);
}

function switchRole(role) {
    // Update buttons
    document.getElementById('student-role-btn').classList.toggle('active', role === 'student');
    document.getElementById('admin-role-btn').classList.toggle('active', role === 'admin');
    
    // Update title and username
    document.getElementById('dashboard-title').textContent = role === 'student' ? 'Student Dashboard' : 'Admin Dashboard';
    document.getElementById('username').textContent = role === 'student' ? 'Student' : 'Admin';
    
    // Show/hide admin panel
    document.getElementById('admin-panel').style.display = role === 'admin' ? 'block' : 'none';
    
    // Show message
    showMessage('Switched to ' + role + ' view');
}

function loadDashboardData() {
    // Update stats
    document.getElementById('today-classes').textContent = '3';
    document.getElementById('week-classes').textContent = '12';
    document.getElementById('next-class').textContent = '10:00 AM';
    document.getElementById('notification-count').textContent = '2';

    // Load classes
    const classesHTML = `
        <div class="class-item">
            <div class="class-header">
                <div class="class-name">WAD62IS - Web Application Development</div>
                <div class="class-time">Today</div>
            </div>
            <div class="class-details">10:00 AM - 11:30 AM | Lab 105 | Dr. Wilfried Kongolo</div>
        </div>
        <div class="class-item">
            <div class="class-header">
                <div class="class-name">MAT101 - Mathematics</div>
                <div class="class-time">Today</div>
            </div>
            <div class="class-details">02:00 PM - 03:30 PM | Room 201 | Prof. Smith</div>
        </div>
        <div class="class-item">
            <div class="class-header">
                <div class="class-name">FAC102 - Financial Accounting</div>
                <div class="class-time">Tomorrow</div>
            </div>
            <div class="class-details">09:00 AM - 10:30 AM | Room 305 | Dr. Johnson</div>
        </div>
    `;
    document.getElementById('upcoming-classes').innerHTML = classesHTML;

    // Load notifications
    const notificationsHTML = `
        <div class="notification-item">
            <div class="notification-header">
                <div class="notification-title">Class Location Change</div>
            </div>
            <div class="notification-message">WAD62IS class moved to Lab 3 this Friday</div>
        </div>
        <div class="notification-item">
            <div class="notification-header">
                <div class="notification-title">New Timetable Published</div>
            </div>
            <div class="notification-message">Timetable for Semester 2 has been published</div>
        </div>
    `;
    document.getElementById('notifications-container').innerHTML = notificationsHTML;
}

function refreshDashboard() {
    showMessage('Refreshing dashboard...');
    setTimeout(() => {
        loadDashboardData();
        showMessage('Dashboard refreshed successfully!');
    }, 1000);
}

function exportTimetable() {
    showMessage('Exporting timetable as PDF...');
}

function viewAllClasses() {
    showMessage('Opening full timetable view...');
}

function clearNotifications() {
    document.getElementById('notifications-container').innerHTML = '<div class="loading-text">No notifications</div>';
    document.getElementById('notification-count').textContent = '0';
    showMessage('All notifications cleared!');
}

function searchClasses() {
    showMessage('Opening search panel...');
}

function printTimetable() {
    showMessage('Opening print dialog...');
}

function viewProfile() {
    showMessage('Opening profile settings...');
}

function manageCourses() {
    showMessage('Opening course management...');
}

function addSchedule() {
    showMessage('Opening schedule editor...');
}

function showMessage(message) {
    // Simple alert for demo purposes
    alert(message);
    console.log(message);
}
// Timetable functionality integrated into dashboard
let timetableData = {};
let currentView = 'weekly';
let currentDayIndex = 2;
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
let filteredData = {};

// Fallback static data
const fallbackData = {
    Monday: [
        { time: '07:30 - 08:30', course: 'DPG621S', code: 'DPG', lecturer: 'Mr. G.K Kapuire', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' },
        { time: '10:30 - 11:30', course: 'MCI521S', code: 'MCI', lecturer: 'MR.A. KACHEPA', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' },
        { time: '14:00 - 15:00', course: 'PRG510S', code: 'PRG', lecturer: 'MR. M.KALE', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' }
    ],
    Tuesday: [
        { time: '09:30 - 10:30', course: 'MCI521S', code: 'MCI', lecturer: 'MR Sebastian', venue: 'Room: D3/G/AUD 3(54)', type: 'Tutorial' },
        { time: '11:30 - 12:00', course: 'COA511S', code: 'COA', lecturer: 'MR. J. W. Silaa', venue: 'D3/LG/FCI lab9(25)', type: 'Practical' },
        { time: '15:00 - 16:00', course: 'DSA521S', code: 'DSA', lecturer: 'MR. N.Indongo', venue: 'Room: K7/G/114(40)ET', type: 'Practical' },
        { time: '16:00 - 17:00', course: 'PRG510S', code: 'PRG', lecturer: 'MR. M.KALE', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' }
    ],
    Wednesday: [
        { time: '07:30 - 08:30', course: 'MCI521S', code: 'MCI', lecturer: 'MR Sebastian', venue: 'Room: D3/G/AUD 3(54)', type: 'Tutorial' },
        { time: '09:30 - 10:30', course: 'COA511S', code: 'COA', lecturer: 'MR. J. W. Silaa', venue: 'D3/LG/FCI lab9(25)', type: 'Practical' },
        { time: '14:00 - 15:00', course: 'DSA521S', code: 'DSA', lecturer: 'MR. N.Indongo', venue: 'Room: K7/G/114(40)ET', type: 'Practical' },
        { time: '15:00 - 16:00', course: 'PRG510S', code: 'PRG', lecturer: 'MR. M.KALE', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' }
    ],
    Thursday: [
        { time: '10:30 - 11:30', course: 'DPG621S', code: 'DPG', lecturer: 'Mr. M.Kasaona', venue: 'Room: A17/1/FCI LAB7(23)', type: 'Theory' },
        { time: '13:00 - 14:00', course: 'MCI521S', code: 'MCI', lecturer: 'MR. Sebastian', venue: 'Room: D3/G/AUD 3(54)', type: 'Theory' },
        { time: '16:00 - 15:00', course: 'PRG510S', code: 'PRG', lecturer: 'MR. M.KALE', venue: 'Room: A17/1/FCI LAB1(28)', type: 'Theory' }
    ],
    Friday: [
        { time: '10:30 - 11:30', course: 'EPR511S', code: 'EPR511S', lecturer: 'Mr.LB Kamwi', venue: 'Room: A17/1/LL1(35)', type: 'meeting' }
    ]
};

// Initialize dashboard stats
function initializeDashboardStats() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = timetableData[today] ? timetableData[today].length : 0;
    
    // Calculate weekly classes
    let weekClasses = 0;
    days.forEach(day => {
        if (timetableData[day]) {
            weekClasses += timetableData[day].length;
        }
    });
    
    // Update stats
    document.getElementById('today-classes').textContent = todayClasses;
    document.getElementById('week-classes').textContent = weekClasses;
    
    // Calculate next class
    const nextClass = findNextClass();
    document.getElementById('next-class').textContent = nextClass;
    
    // Update notification count
    updateNotificationCount();
}

function findNextClass() {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const today = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    if (timetableData[today]) {
        for (const classItem of timetableData[today]) {
            const [startTime] = classItem.time.split(' - ');
            const [hours, minutes] = startTime.split(':').map(Number);
            const classTime = hours * 100 + minutes;
            
            if (classTime > currentTime) {
                return startTime;
            }
        }
    }
    
    return '--:--';
}

function updateNotificationCount() {
    const count = Math.floor(Math.random() * 5);
    document.getElementById('notification-count').textContent = count;
}

async function loadTimetable() {
    const loadingNotification = showNotification('🔄 Loading timetable data...', 'info');
    
    try {
        // Using fallback data for demo
        timetableData = fallbackData;
        showNotification('✅ Timetable loaded successfully!', 'success');
    } catch (error) {
        console.error('Database fetch failed, using fallback data:', error);
        timetableData = fallbackData;
        showNotification('⚠️ Using fallback timetable data', 'warning');
    } finally {
        filteredData = JSON.parse(JSON.stringify(timetableData));
        if (currentView === 'weekly') renderWeeklyView();
        else renderDailyView(days[currentDayIndex]);
        
        initializeDashboardStats();
        setTimeout(() => {
            if (loadingNotification && loadingNotification.remove) {
                loadingNotification.remove();
            }
        }, 2000);
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadTimetable();
    setupEventListeners();
});

function setupEventListeners() {
    // Timetable event listeners
    document.getElementById('search-course').addEventListener('input', applyFilters);
    document.getElementById('search-lecturer').addEventListener('input', applyFilters);
    document.getElementById('filter-day').addEventListener('change', applyFilters);
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('reset-filters').addEventListener('click', resetFilters);
    
    // View toggle
    document.getElementById('weekly-btn').addEventListener('click', () => toggleView('weekly'));
    document.getElementById('daily-btn').addEventListener('click', () => toggleView('daily'));
    
    // Day navigation
    document.getElementById('prev-day').addEventListener('click', () => changeDay(-1));
    document.getElementById('next-day').addEventListener('click', () => changeDay(1));
    
    // Dashboard buttons
    document.getElementById('refresh-btn').addEventListener('click', () => {
        loadTimetable();
        showNotification('Timetable refreshed!');
    });
    
    // Role toggle
    document.getElementById('student-role-btn').addEventListener('click', () => switchRole('student'));
    document.getElementById('admin-role-btn').addEventListener('click', () => switchRole('admin'));
    
    // Quick actions
    document.getElementById('search-classes').addEventListener('click', () => {
        document.getElementById('search-course').focus();
        showNotification('Use the search filters above to find classes');
    });
    
    document.getElementById('print-timetable').addEventListener('click', () => {
        window.print();
        showNotification('Preparing for printing...');
    });
    
    document.getElementById('view-profile').addEventListener('click', () => {
        showNotification('Profile page coming soon!');
    });
    
    // Admin actions
    document.getElementById('manage-courses').addEventListener('click', () => {
        showNotification('Course management panel opening...');
    });
    
    document.getElementById('add-schedule').addEventListener('click', () => {
        showNotification('Add schedule feature coming soon!');
    });
    
    // Clear notifications
    document.getElementById('clear-notifications').addEventListener('click', () => {
        document.getElementById('notifications-container').innerHTML = '<div class="loading-text">No notifications</div>';
        showNotification('Notifications cleared');
    });
}

function switchRole(role) {
    const studentBtn = document.getElementById('student-role-btn');
    const adminBtn = document.getElementById('admin-role-btn');
    const adminPanel = document.getElementById('admin-panel');
    const dashboardTitle = document.getElementById('dashboard-title');
    
    if (role === 'admin') {
        studentBtn.classList.remove('active');
        adminBtn.classList.add('active');
        adminPanel.style.display = 'block';
        dashboardTitle.textContent = 'Admin Dashboard';
        showNotification('Switched to Admin View');
    } else {
        studentBtn.classList.add('active');
        adminBtn.classList.remove('active');
        adminPanel.style.display = 'none';
        dashboardTitle.textContent = 'Student Dashboard';
        showNotification('Switched to Student View');
    }
}

// ===== TIMETABLE RENDERING FUNCTIONS =====

function toggleView(view) {
    currentView = view;
    
    document.getElementById('weekly-btn').classList.toggle('active', view === 'weekly');
    document.getElementById('daily-btn').classList.toggle('active', view === 'daily');
    
    document.getElementById('weekly-view').style.display = view === 'weekly' ? 'block' : 'none';
    document.getElementById('daily-view').style.display = view === 'daily' ? 'block' : 'none';
    
    if (view === 'daily') {
        renderDailyView(days[currentDayIndex]);
    } else {
        renderWeeklyView();
    }
}

function renderWeeklyView(data = filteredData) {
    const tbody = document.getElementById('weekly-tbody');
    tbody.innerHTML = '';
    
    const timeSlots = generateTimeSlots();
    
    timeSlots.forEach(slot => {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="time-slot">${slot}</td>`;
        
        days.forEach(day => {
            const cell = document.createElement('td');
            const events = data[day]?.filter(event => event.time === slot) || [];
            
            if (events.length > 0) {
                events.forEach(event => {
                    const eventElement = createEventElement(event);
                    cell.appendChild(eventElement);
                });
            } else {
                cell.innerHTML = '<div class="empty-slot">-</div>';
            }
            
            row.appendChild(cell);
        });
        
        tbody.appendChild(row);
    });
}

function renderDailyView(day, data = filteredData[day] || []) {
    document.getElementById('current-day').textContent = day;
    const tbody = document.getElementById('daily-tbody');
    tbody.innerHTML = '';
    
    const timeSlots = generateTimeSlots();
    
    timeSlots.forEach(slot => {
        const row = document.createElement('tr');
        row.innerHTML = `<td class="time-slot">${slot}</td>`;
        
        const cell = document.createElement('td');
        const events = data.filter(event => event.time === slot);
        
        if (events.length > 0) {
            events.forEach(event => {
                const eventElement = createEventElement(event);
                cell.appendChild(eventElement);
            });
        } else {
            cell.innerHTML = '<div class="empty-slot">No classes scheduled</div>';
        }
        
        row.appendChild(cell);
        tbody.appendChild(row);
    });
}

function createEventElement(event) {
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.innerHTML = `
        <div class="event-course">${event.course}</div>
        <div class="event-details">
            <div class="event-lecturer">${event.lecturer}</div>
            <div class="event-venue">${event.venue}</div>
        </div>
    `;
    
    eventDiv.addEventListener('click', () => showEventDetails(event));
    
    return eventDiv;
}

function showEventDetails(event) {
    alert(`Course: ${event.course} (${event.code})\nLecturer: ${event.lecturer}\nVenue: ${event.venue}\nTime: ${event.time}\nType: ${event.type}`);
}

function generateTimeSlots() {
    return [
        '07:30 - 08:30',
        '08:30 - 09:30',
        '09:30 - 10:30',
        '10:30 - 11:30',
        '11:30 - 12:30',
        '13:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
        '16:00 - 17:00'
    ];
}

function changeDay(direction) {
    currentDayIndex = (currentDayIndex + direction + days.length) % days.length;
    renderDailyView(days[currentDayIndex]);
}

function applyFilters() {
    const courseQuery = document.getElementById('search-course').value.toLowerCase();
    const lecturerQuery = document.getElementById('search-lecturer').value.toLowerCase();
    const dayFilter = document.getElementById('filter-day').value;

    filteredData = JSON.parse(JSON.stringify(timetableData));

    Object.keys(filteredData).forEach(day => {
        if (dayFilter && day !== dayFilter) {
            delete filteredData[day];
        } else {
            filteredData[day] = filteredData[day].filter(event => {
                const matchesCourse = !courseQuery || 
                    event.course.toLowerCase().includes(courseQuery) ||
                    (event.code && event.code.toLowerCase().includes(courseQuery));
                
                const matchesLecturer = !lecturerQuery || 
                    event.lecturer.toLowerCase().includes(lecturerQuery);
                
                return matchesCourse && matchesLecturer;
            });
        }
    });

    if (currentView === 'weekly') {
        renderWeeklyView(filteredData);
    } else {
        const currentDay = days[currentDayIndex];
        if (filteredData[currentDay]) {
            renderDailyView(currentDay, filteredData[currentDay]);
        } else {
            renderDailyView(currentDay, []);
        }
    }
    
    showNotification('Filters applied successfully!');
}

function resetFilters() {
    document.getElementById('search-course').value = '';
    document.getElementById('search-lecturer').value = '';
    document.getElementById('filter-day').value = '';
    
    filteredData = JSON.parse(JSON.stringify(timetableData));
    
    if (currentView === 'weekly') {
        renderWeeklyView();
    } else {
        renderDailyView(days[currentDayIndex]);
    }
    
    showNotification('Filters reset successfully!');
}

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add type-based styling
    if (type === 'success') {
        notification.style.background = 'var(--success)';
    } else if (type === 'warning') {
        notification.style.background = 'var(--warning)';
    } else if (type === 'error') {
        notification.style.background = '#dc3545';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
    
    return notification;
}

// Update dashboard based on user role
function updateUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('username').textContent = user.username;
        
        // Show/hide admin features based on role
        if (user.user_type === 'admin') {
            document.getElementById('admin-panel').style.display = 'block';
            document.getElementById('dashboard-title').textContent = 'Admin Dashboard';
        } else {
            document.getElementById('admin-panel').style.display = 'none';
            document.getElementById('dashboard-title').textContent = 'Student Dashboard';
        }
    }
}

// Add this function back to your dashboard-script.js
function printTimetable() {
    console.log('Printing timetable...');
    
    // Store current view
    const originalView = currentView;
    
    // Switch to weekly view for printing (better layout)
    if (currentView === 'daily') {
        toggleView('weekly');
    }
    
    // Wait a moment for the view to switch, then print
    setTimeout(() => {
        window.print();
        
        // Switch back to original view after print dialog closes
        setTimeout(() => {
            if (originalView === 'daily') {
                toggleView('daily');
            }
        }, 500);
        
    }, 100);
}


function setupEventListeners() {
   
    // Print timetable button
    const printBtn = document.getElementById('print-timetable');
    if (printBtn) {
        printBtn.addEventListener('click', printTimetable);
    }
    
    
}
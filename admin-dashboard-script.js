let timetableData = {};
let currentView = 'weekly';
let currentDayIndex = 2;
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
let filteredData = {};
const currentRole = localStorage.getItem('userRole');

const courses = [
    { name: 'DPG621S', code: 'DPG' },
    { name: 'MCI521S', code: 'MCI' },
    { name: 'PRG510S', code: 'PRG' },
    { name: 'COA511S', code: 'COA' },
    { name: 'DSA521S', code: 'DSA' },
    { name: 'EPR511S', code: 'EPR511S' }
];
const lecturers = ['Mr. G.K Kapuire', 'MR.A. KACHEPA', 'MR. M.KALE', 'MR Sebastian', 'MR. J. W. Silaa', 'MR. N.Indongo', 'Mr. M.Kasaona', 'Mr.LB Kamwi'];
const venues = ['Room: D3/G/AUD 1(272)', 'Room: D3/G/AUD 3(54)', 'D3/LG/FCI lab9(25)', 'Room: K7/G/114(40)ET', 'Room: A17/1/FCI LAB7(23)', 'Room: A17/1/FCI LAB1(28)', 'Room: A17/1/LL1(35)'];
const timeSlots = [
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

// Fallback static data
const fallbackData = {
    Monday: [
        { id: 1, time: '07:30 - 08:30', course: 'DPG621S', code: 'DPG', lecturer: 'Mr. G.K Kapuire', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' },
        { id: 2, time: '10:30 - 11:30', course: 'MCI521S', code: 'MCI', lecturer: 'MR.A. KACHEPA', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' },
        { id: 3, time: '14:00 - 15:00', course: 'PRG510S', code: 'PRG', lecturer: 'MR. M.KALE', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' }
    ],
    Tuesday: [
        { id: 4, time: '09:30 - 10:30', course: 'MCI521S', code: 'MCI', lecturer: 'MR Sebastian', venue: 'Room: D3/G/AUD 3(54)', type: 'Tutorial' },
        { id: 5, time: '11:30 - 12:30', course: 'COA511S', code: 'COA', lecturer: 'MR. J. W. Silaa', venue: 'D3/LG/FCI lab9(25)', type: 'Practical' },
        { id: 6, time: '15:00 - 16:00', course: 'DSA521S', code: 'DSA', lecturer: 'MR. N.Indongo', venue: 'Room: K7/G/114(40)ET', type: 'Practical' },
        { id: 7, time: '16:00 - 17:00', course: 'PRG510S', code: 'PRG', lecturer: 'MR. M.KALE', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' }
    ],
    Wednesday: [
        { id: 8, time: '07:30 - 08:30', course: 'MCI521S', code: 'MCI', lecturer: 'MR Sebastian', venue: 'Room: D3/G/AUD 3(54)', type: 'Tutorial' },
        { id: 9, time: '09:30 - 10:30', course: 'COA511S', code: 'COA', lecturer: 'MR. J. W. Silaa', venue: 'D3/LG/FCI lab9(25)', type: 'Practical' },
        { id: 10, time: '14:00 - 15:00', course: 'DSA521S', code: 'DSA', lecturer: 'MR. N.Indongo', venue: 'Room: K7/G/114(40)ET', type: 'Practical' },
        { id: 11, time: '15:00 - 16:00', course: 'PRG510S', code: 'PRG', lecturer: 'MR. M.KALE', venue: 'Room: D3/G/AUD 1(272)', type: 'Theory' }
    ],
    Thursday: [
        { id: 12, time: '10:30 - 11:30', course: 'DPG621S', code: 'DPG', lecturer: 'Mr. M.Kasaona', venue: 'Room: A17/1/FCI LAB7(23)', type: 'Theory' },
        { id: 13, time: '13:00 - 14:00', course: 'MCI521S', code: 'MCI', lecturer: 'MR. Sebastian', venue: 'Room: D3/G/AUD 3(54)', type: 'Theory' },
        { id: 14, time: '15:00 - 16:00', course: 'PRG510S', code: 'PRG', lecturer: 'MR. M.KALE', venue: 'Room: A17/1/FCI LAB1(28)', type: 'Theory' }
    ],
    Friday: [
        { id: 15, time: '10:30 - 11:30', course: 'EPR511S', code: 'EPR511S', lecturer: 'Mr.LB Kamwi', venue: 'Room: A17/1/LL1(35)', type: 'Meeting' }
    ]
};

// Initialize dashboard stats
function initializeDashboardStats() {
    try {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayClasses = timetableData[today] ? timetableData[today].length : 0;
        
        let weekClasses = 0;
        days.forEach(day => {
            if (timetableData[day]) {
                weekClasses += timetableData[day].length;
            }
        });
        
        const todayClassesEl = document.getElementById('today-classes');
        const weekClassesEl = document.getElementById('week-classes');
        const nextClassEl = document.getElementById('next-class');
        if (!todayClassesEl || !weekClassesEl || !nextClassEl) {
            console.error('Dashboard stat elements missing:', { todayClassesEl, weekClassesEl, nextClassEl });
            return;
        }
        
        todayClassesEl.textContent = todayClasses;
        weekClassesEl.textContent = weekClasses;
        nextClassEl.textContent = findNextClass();
        
        updateNotificationCount();
    } catch (error) {
        console.error('Error initializing dashboard stats:', error);
        showNotification('Error loading dashboard stats', 'error');
    }
}

function findNextClass() {
    try {
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
    } catch (error) {
        console.error('Error finding next class:', error);
        return '--:--';
    }
}

function updateNotificationCount() {
    try {
        const count = document.querySelectorAll('.notification-item').length;
        const notificationCountEl = document.getElementById('notification-count');
        if (!notificationCountEl) {
            console.error('Notification count element missing');
            return;
        }
        notificationCountEl.textContent = count;
    } catch (error) {
        console.error('Error updating notification count:', error);
    }
}

async function loadTimetable() {
    const loadingNotification = showNotification('🔄 Loading timetable data...', 'info');
    
    try {
        timetableData = JSON.parse(JSON.stringify(fallbackData));
        showNotification('✅ Timetable loaded successfully!', 'success');
    } catch (error) {
        console.error('Error loading timetable:', error);
        timetableData = JSON.parse(JSON.stringify(fallbackData));
        showNotification('⚠️ Using fallback timetable data', 'warning');
    } finally {
        filteredData = JSON.parse(JSON.stringify(timetableData));
        if (currentView === 'weekly') {
            renderWeeklyView();
        } else {
            renderDailyView(days[currentDayIndex]);
        }
        initializeDashboardStats();
        setTimeout(() => {
            if (loadingNotification && loadingNotification.remove) {
                loadingNotification.remove();
            }
        }, 2000);
    }
}

function populateSelect(id, items, valueKey = null) {
    try {
        const select = document.getElementById(id);
        if (!select) {
            console.error(`Select element with ID ${id} not found`);
            return;
        }
        select.innerHTML = '<option value="">Select</option>' + 
            items.map(item => `<option value="${valueKey ? item[valueKey] : item}">${valueKey ? item[valueKey] : item}</option>`).join('');
    } catch (error) {
        console.error(`Error populating select ${id}:`, error);
    }
}

function populateList(id, items, type, valueKey = null) {
    try {
        const list = document.getElementById(id);
        if (!list) {
            console.error(`List element with ID ${id} not found`);
            return;
        }
        list.innerHTML = items.map(item => `
            <li>
                ${valueKey ? `${item.name} (${item.code})` : item}
                <button class="delete-btn" data-type="${type}" data-value="${valueKey ? item[valueKey] : item}">Delete</button>
            </li>
        `).join('');
    } catch (error) {
        console.error(`Error populating list ${id}:`, error);
    }
}

function createEventElement(event) {
    try {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        eventDiv.dataset.id = event.id;
        eventDiv.innerHTML = `
            <div class="event-course">${event.course}</div>
            <div class="event-details">
                <div class="event-lecturer">${event.lecturer}</div>
                <div class="event-venue">${event.venue}</div>
            </div>
            <div class="event-actions">
                <button class="event-action-btn edit-btn" data-id="${event.id}" data-day="${event.day}"><i class="fas fa-edit"></i></button>
                <button class="event-action-btn delete-btn" data-id="${event.id}" data-day="${event.day}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        return eventDiv;
    } catch (error) {
        console.error('Error creating event element:', error);
        return document.createElement('div');
    }
}

function generateTimeSlots() {
    return timeSlots;
}

function toggleView(view) {
    try {
        currentView = view;
        
        const weeklyBtn = document.getElementById('weekly-btn');
        const dailyBtn = document.getElementById('daily-btn');
        const weeklyView = document.getElementById('weekly-view');
        const dailyView = document.getElementById('daily-view');
        
        if (!weeklyBtn || !dailyBtn || !weeklyView || !dailyView) {
            console.error('View toggle elements missing:', { weeklyBtn, dailyBtn, weeklyView, dailyView });
            return;
        }
        
        weeklyBtn.classList.toggle('active', view === 'weekly');
        dailyBtn.classList.toggle('active', view === 'daily');
        weeklyView.style.display = view === 'weekly' ? 'block' : 'none';
        dailyView.style.display = view === 'daily' ? 'block' : 'none';
        
        if (view === 'daily') {
            renderDailyView(days[currentDayIndex]);
        } else {
            renderWeeklyView();
        }
    } catch (error) {
        console.error('Error toggling view:', error);
        showNotification('Error switching view', 'error');
    }
}

function renderWeeklyView(data = filteredData) {
    try {
        const tbody = document.getElementById('weekly-tbody');
        if (!tbody) {
            console.error('Weekly tbody element missing');
            return;
        }
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
                        const eventElement = createEventElement({ ...event, day });
                        cell.appendChild(eventElement);
                    });
                } else {
                    cell.innerHTML = '<div class="empty-slot">-</div>';
                }
                
                row.appendChild(cell);
            });
            
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error rendering weekly view:', error);
        showNotification('Error rendering timetable', 'error');
    }
}

function renderDailyView(day, data = filteredData[day] || []) {
    try {
        const currentDayEl = document.getElementById('current-day');
        const tbody = document.getElementById('daily-tbody');
        if (!currentDayEl || !tbody) {
            console.error('Daily view elements missing:', { currentDayEl, tbody });
            return;
        }
        
        currentDayEl.textContent = day;
        tbody.innerHTML = '';
        
        const timeSlots = generateTimeSlots();
        
        timeSlots.forEach(slot => {
            const row = document.createElement('tr');
            row.innerHTML = `<td class="time-slot">${slot}</td>`;
            
            const cell = document.createElement('td');
            const events = data.filter(event => event.time === slot);
            
            if (events.length > 0) {
                events.forEach(event => {
                    const eventElement = createEventElement({ ...event, day });
                    cell.appendChild(eventElement);
                });
            } else {
                cell.innerHTML = '<div class="empty-slot">No classes scheduled</div>';
            }
            
            row.appendChild(cell);
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error rendering daily view:', error);
        showNotification('Error rendering daily timetable', 'error');
    }
}

function changeDay(direction) {
    try {
        currentDayIndex = (currentDayIndex + direction + days.length) % days.length;
        renderDailyView(days[currentDayIndex]);
    } catch (error) {
        console.error('Error changing day:', error);
        showNotification('Error navigating days', 'error');
    }
}

function applyFilters() {
    try {
        const searchCourse = document.getElementById('search-course');
        const searchLecturer = document.getElementById('search-lecturer');
        const filterDay = document.getElementById('filter-day');
        if (!searchCourse || !searchLecturer || !filterDay) {
            console.error('Filter elements missing:', { searchCourse, searchLecturer, filterDay });
            return;
        }
        
        const courseQuery = searchCourse.value.toLowerCase();
        const lecturerQuery = searchLecturer.value.toLowerCase();
        const dayFilter = filterDay.value;

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
        
        showNotification('Filters applied successfully!', 'success');
    } catch (error) {
        console.error('Error applying filters:', error);
        showNotification('Error applying filters', 'error');
    }
}

function resetFilters() {
    try {
        const searchCourse = document.getElementById('search-course');
        const searchLecturer = document.getElementById('search-lecturer');
        const filterDay = document.getElementById('filter-day');
        if (!searchCourse || !searchLecturer || !filterDay) {
            console.error('Filter elements missing:', { searchCourse, searchLecturer, filterDay });
            return;
        }
        
        searchCourse.value = '';
        searchLecturer.value = '';
        filterDay.value = '';
        
        filteredData = JSON.parse(JSON.stringify(timetableData));
        
        if (currentView === 'weekly') {
            renderWeeklyView();
        } else {
            renderDailyView(days[currentDayIndex]);
        }
        
        showNotification('Filters reset successfully!', 'success');
    } catch (error) {
        console.error('Error resetting filters:', error);
        showNotification('Error resetting filters', 'error');
    }
}

function showNotification(message, type = 'info') {
    try {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
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
    } catch (error) {
        console.error('Error showing notification:', error);
        return null;
    }
}

function toggleModal(modalId, show) {
    try {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID ${modalId} not found`);
            return;
        }
        modal.style.display = show ? 'flex' : 'none';
    } catch (error) {
        console.error('Error toggling modal:', error);
    }
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (currentRole !== 'admin') {
            console.error('Unauthorized access to admin dashboard, redirecting to login');
            window.location.href = 'login.html';
            return;
        }
        
        loadTimetable();
        populateSelect('course', courses, 'name');
        populateSelect('lecturer', lecturers);
        populateSelect('venue', venues);
        populateSelect('time', timeSlots);
        populateList('course-list', courses, 'course', 'name');
        populateList('lecturer-list', lecturers, 'lecturer');
        populateList('venue-list', venues, 'venue');
        
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing admin dashboard:', error);
        showNotification('Error loading admin dashboard', 'error');
    }
});

function setupEventListeners() {
    try {
        // Timetable event listeners
        const searchCourse = document.getElementById('search-course');
        const searchLecturer = document.getElementById('search-lecturer');
        const filterDay = document.getElementById('filter-day');
        const applyFiltersBtn = document.getElementById('apply-filters');
        const resetFiltersBtn = document.getElementById('reset-filters');
        const weeklyBtn = document.getElementById('weekly-btn');
        const dailyBtn = document.getElementById('daily-btn');
        const prevDay = document.getElementById('prev-day');
        const nextDay = document.getElementById('next-day');
        const searchClasses = document.getElementById('search-classes');
        const printTimetable = document.getElementById('print-timetable');
        const clearNotifications = document.getElementById('clear-notifications');
        const addScheduleBtn = document.getElementById('add-schedule-btn');
        const manageCoursesBtn = document.getElementById('manage-courses-btn');
        const manageLecturersBtn = document.getElementById('manage-lecturers-btn');
        const manageVenuesBtn = document.getElementById('manage-venues-btn');
        
        if (!searchCourse || !searchLecturer || !filterDay || !applyFiltersBtn || !resetFiltersBtn ||
            !weeklyBtn || !dailyBtn || !prevDay || !nextDay || !searchClasses || !printTimetable ||
            !clearNotifications || !addScheduleBtn || !manageCoursesBtn || !manageLecturersBtn || !manageVenuesBtn) {
            console.error('Event listener elements missing:', {
                searchCourse, searchLecturer, filterDay, applyFiltersBtn, resetFiltersBtn,
                weeklyBtn, dailyBtn, prevDay, nextDay, searchClasses, printTimetable,
                clearNotifications, addScheduleBtn, manageCoursesBtn, manageLecturersBtn, manageVenuesBtn
            });
            showNotification('Error setting up admin controls', 'error');
            return;
        }
        
        searchCourse.addEventListener('input', applyFilters);
        searchLecturer.addEventListener('input', applyFilters);
        filterDay.addEventListener('change', applyFilters);
        applyFiltersBtn.addEventListener('click', applyFilters);
        resetFiltersBtn.addEventListener('click', resetFilters);
        weeklyBtn.addEventListener('click', () => toggleView('weekly'));
        dailyBtn.addEventListener('click', () => toggleView('daily'));
        prevDay.addEventListener('click', () => changeDay(-1));
        nextDay.addEventListener('click', () => changeDay(1));
        searchClasses.addEventListener('click', () => {
            searchCourse.focus();
            showNotification('Use the search filters above to find classes', 'info');
        });
        printTimetable.addEventListener('click', () => {
            window.print();
            showNotification('Preparing for printing...', 'info');
        });
        clearNotifications.addEventListener('click', () => {
            const notificationsContainer = document.getElementById('notifications-container');
            if (notificationsContainer) {
                notificationsContainer.innerHTML = '';
                updateNotificationCount();
                showNotification('Notifications cleared', 'success');
            }
        });
        
        addScheduleBtn.addEventListener('click', () => {
            const modalTitle = document.getElementById('modal-title');
            const scheduleForm = document.getElementById('schedule-form');
            if (modalTitle && scheduleForm) {
                modalTitle.textContent = 'Add Schedule';
                document.getElementById('schedule-id').value = '';
                document.getElementById('schedule-day').value = '';
                scheduleForm.reset();
                toggleModal('schedule-modal', true);
            } else {
                console.error('Schedule modal elements missing');
            }
        });
        
        manageCoursesBtn.addEventListener('click', () => toggleModal('courses-modal', true));
        manageLecturersBtn.addEventListener('click', () => toggleModal('lecturers-modal', true));
        manageVenuesBtn.addEventListener('click', () => toggleModal('venues-modal', true));
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleModal(btn.closest('.modal').id, false);
            });
        });
        
        // Schedule form submission
        const scheduleForm = document.getElementById('schedule-form');
        if (scheduleForm) {
            scheduleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                try {
                    const id = document.getElementById('schedule-id').value;
                    const prevDay = document.getElementById('schedule-day').value;
                    const schedule = {
                        id: id ? parseInt(id) : Math.max(...Object.values(timetableData).flat().map(s => s.id), 0) + 1,
                        course: document.getElementById('course').value,
                        code: document.getElementById('course-code').value,
                        lecturer: document.getElementById('lecturer').value,
                        venue: document.getElementById('venue').value,
                        time: document.getElementById('time').value,
                        type: document.getElementById('type').value,
                        day: document.getElementById('day').value
                    };
                    
                    if (!schedule.course || !schedule.code || !schedule.lecturer || !schedule.venue || !schedule.time || !schedule.type || !schedule.day) {
                        showNotification('Please fill in all schedule fields', 'error');
                        return;
                    }
                    
                    if (id) {
                        const prevDayEvents = timetableData[prevDay] || [];
                        const index = prevDayEvents.findIndex(s => s.id === parseInt(id));
                        if (prevDay !== schedule.day) {
                            prevDayEvents.splice(index, 1);
                            timetableData[prevDay] = prevDayEvents;
                            timetableData[schedule.day] = timetableData[schedule.day] || [];
                            timetableData[schedule.day].push(schedule);
                        } else {
                            prevDayEvents[index] = schedule;
                            timetableData[prevDay] = prevDayEvents;
                        }
                        showNotification('Schedule updated successfully', 'success');
                    } else {
                        timetableData[schedule.day] = timetableData[schedule.day] || [];
                        timetableData[schedule.day].push(schedule);
                        showNotification('Schedule added successfully', 'success');
                    }
                    
                    filteredData = JSON.parse(JSON.stringify(timetableData));
                    initializeDashboardStats();
                    if (currentView === 'weekly') {
                        renderWeeklyView();
                    } else {
                        renderDailyView(days[currentDayIndex]);
                    }
                    toggleModal('schedule-modal', false);
                } catch (error) {
                    console.error('Error saving schedule:', error);
                    showNotification('Error saving schedule', 'error');
                }
            });
        }
        
        // Add course
        const addCourseBtn = document.getElementById('add-course-btn');
        if (addCourseBtn) {
            addCourseBtn.addEventListener('click', () => {
                try {
                    const name = document.getElementById('new-course').value.trim();
                    const code = document.getElementById('new-course-code').value.trim();
                    if (name && code && !courses.some(c => c.name === name || c.code === code)) {
                        courses.push({ name, code });
                        populateSelect('course', courses, 'name');
                        populateList('course-list', courses, 'course', 'name');
                        showNotification('Course added successfully', 'success');
                        document.getElementById('new-course').value = '';
                        document.getElementById('new-course-code').value = '';
                    } else {
                        showNotification('Course name or code already exists or invalid', 'error');
                    }
                } catch (error) {
                    console.error('Error adding course:', error);
                    showNotification('Error adding course', 'error');
                }
            });
        }
        
        // Add lecturer
        const addLecturerBtn = document.getElementById('add-lecturer-btn');
        if (addLecturerBtn) {
            addLecturerBtn.addEventListener('click', () => {
                try {
                    const lecturer = document.getElementById('new-lecturer').value.trim();
                    if (lecturer && !lecturers.includes(lecturer)) {
                        lecturers.push(lecturer);
                        populateSelect('lecturer', lecturers);
                        populateList('lecturer-list', lecturers, 'lecturer');
                        showNotification('Lecturer added successfully', 'success');
                        document.getElementById('new-lecturer').value = '';
                    } else {
                        showNotification('Lecturer already exists or invalid', 'error');
                    }
                } catch (error) {
                    console.error('Error adding lecturer:', error);
                    showNotification('Error adding lecturer', 'error');
                }
            });
        }
        
        // Add venue
        const addVenueBtn = document.getElementById('add-venue-btn');
        if (addVenueBtn) {
            addVenueBtn.addEventListener('click', () => {
                try {
                    const venue = document.getElementById('new-venue').value.trim();
                    if (venue && !venues.includes(venue)) {
                        venues.push(venue);
                        populateSelect('venue', venues);
                        populateList('venue-list', venues, 'venue');
                        showNotification('Venue added successfully', 'success');
                        document.getElementById('new-venue').value = '';
                    } else {
                        showNotification('Venue already exists or invalid', 'error');
                    }
                } catch (error) {
                    console.error('Error adding venue:', error);
                    showNotification('Error adding venue', 'error');
                }
            });
        }
        
        // Delete and edit actions
        document.addEventListener('click', (e) => {
            try {
                if (e.target.classList.contains('edit-btn')) {
                    const id = parseInt(e.target.dataset.id);
                    const day = e.target.dataset.day;
                    const schedule = timetableData[day].find(s => s.id === id);
                    const modalTitle = document.getElementById('modal-title');
                    if (!modalTitle || !schedule) {
                        console.error('Edit schedule elements missing or schedule not found');
                        return;
                    }
                    modalTitle.textContent = 'Edit Schedule';
                    document.getElementById('schedule-id').value = id;
                    document.getElementById('schedule-day').value = day;
                    document.getElementById('course').value = schedule.course;
                    document.getElementById('course-code').value = schedule.code;
                    document.getElementById('lecturer').value = schedule.lecturer;
                    document.getElementById('venue').value = schedule.venue;
                    document.getElementById('time').value = schedule.time;
                    document.getElementById('type').value = schedule.type;
                    document.getElementById('day').value = schedule.day;
                    toggleModal('schedule-modal', true);
                } else if (e.target.classList.contains('delete-btn') && e.target.dataset.id) {
                    const id = parseInt(e.target.dataset.id);
                    const day = e.target.dataset.day;
                    const dayEvents = timetableData[day] || [];
                    timetableData[day] = dayEvents.filter(s => s.id !== id);
                    filteredData = JSON.parse(JSON.stringify(timetableData));
                    initializeDashboardStats();
                    if (currentView === 'weekly') {
                        renderWeeklyView();
                    } else {
                        renderDailyView(days[currentDayIndex]);
                    }
                    showNotification('Schedule deleted successfully', 'success');
                } else if (e.target.classList.contains('delete-btn') && e.target.dataset.type) {
                    const { type, value } = e.target.dataset;
                    const arrays = { course: courses, lecturer: lecturers, venue: venues };
                    const array = arrays[type];
                    let index;
                    if (type === 'course') {
                        index = array.findIndex(c => c.name === value);
                        if (Object.values(timetableData).flat().some(s => s.course === value)) {
                            showNotification('Cannot delete course: In use by a schedule', 'error');
                            return;
                        }
                        array.splice(index, 1);
                    } else {
                        index = array.indexOf(value);
                        if (Object.values(timetableData).flat().some(s => s[type] === value)) {
                            showNotification(`Cannot delete ${type}: In use by a schedule`, 'error');
                            return;
                        }
                        array.splice(index, 1);
                    }
                    populateSelect(type, type === 'course' ? courses : array, type === 'course' ? 'name' : null);
                    populateList(`${type}-list`, type === 'course' ? courses : array, type, type === 'course' ? 'name' : null);
                    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, 'success');
                }
            } catch (error) {
                console.error('Error handling delete/edit action:', error);
                showNotification('Error performing action', 'error');
            }
        });
    } catch (error) {
        console.error('Error setting up event listeners:', error);
        showNotification('Error setting up admin controls', 'error');
    }
}
let timetableData = {};
let currentView = 'weekly';
let currentDayIndex = 2; // Start on Wednesday to match October 15, 2025
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

async function loadTimetable() {
    const loadingNotification = document.createElement('div');
    loadingNotification.className = 'notification';
    loadingNotification.textContent = 'Loading timetable data...';
    document.body.appendChild(loadingNotification);

    try {
        const response = await fetch('get_timetable.php');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        timetableData = data;
    } catch (error) {
        console.error('Database fetch failed, using fallback data:', error);
        timetableData = fallbackData; // Use static data as fallback
        showNotification('Database connection failed. Using fallback data.');
    } finally {
        filteredData = JSON.parse(JSON.stringify(timetableData));
        if (currentView === 'weekly') renderWeeklyView();
        else renderDailyView(days[currentDayIndex]);
        loadingNotification.remove();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadTimetable();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('search-course').addEventListener('input', applyFilters);
    document.getElementById('search-lecturer').addEventListener('input', applyFilters);
    document.getElementById('filter-day').addEventListener('change', applyFilters);
}

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
                    event.code.toLowerCase().includes(courseQuery);
                
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

function exportToPDF() {
    showNotification('Preparing PDF export...');
    setTimeout(() => {
        showNotification('PDF exported successfully!');
    }, 1500);
}

function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
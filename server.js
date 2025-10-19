const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Get timetable data API
app.get('/api/timetable', async (req, res) => {
    try {
        console.log('Fetching timetable data...');
        
        // Check if timetable table exists, if not use fallback data
        const [tables] = await db.execute("SHOW TABLES LIKE 'timetable'");
        
        if (tables.length === 0) {
            console.log('Timetable table not found, using fallback data');
            const fallbackData = getFallbackData();
            return res.json(fallbackData);
        }
        
        // Get data from timetable table
        const [rows] = await db.execute(`
            SELECT * FROM timetable 
            ORDER BY 
                CASE day_of_week 
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                END, 
                start_time
        `);
        
        console.log(`Found ${rows.length} timetable entries`);
        
        // Format data for frontend
        const timetableData = {};
        rows.forEach(row => {
            const day = row.day_of_week;
            if (!timetableData[day]) {
                timetableData[day] = [];
            }
            
            // Format time properly
            const startTime = formatTime(row.start_time);
            const endTime = formatTime(row.end_time);
            
            timetableData[day].push({
                time: `${startTime} - ${endTime}`,
                course: row.course_name || row.course_code || 'Unknown Course',
                code: row.course_code || 'N/A',
                lecturer: row.lecturer || 'Unknown Lecturer',
                venue: row.room || 'Unknown Room',
                type: 'Class'
            });
        });
        
        res.json(timetableData);
        
    } catch (error) {
        console.error('Database error:', error);
        // Return fallback data on error
        const fallbackData = getFallbackData();
        res.json(fallbackData);
    }
});

// Helper function to format time
function formatTime(time) {
    if (!time) return '00:00';
    const timeStr = time.toString();
    return timeStr.substring(0, 5); // Get HH:MM format
}

// Login API - using your users table
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if users table exists
        const [userTables] = await db.execute("SHOW TABLES LIKE 'users'");
        if (userTables.length === 0) {
            return res.status(401).json({ error: 'Users table not found' });
        }
        
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ? AND password_hash = ?',
            [username, password]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = rows[0];
        res.json({
            id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            user_type: user.user_type,
            email: user.email
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Create sample timetable data API
app.get('/api/create-timetable', async (req, res) => {
    try {
        // Create timetable table if it doesn't exist
        await db.execute(`
            CREATE TABLE IF NOT EXISTS timetable (
                timetable_id INT PRIMARY KEY AUTO_INCREMENT,
                course_name VARCHAR(100),
                course_code VARCHAR(20),
                day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'),
                start_time TIME,
                end_time TIME,
                room VARCHAR(50),
                lecturer VARCHAR(100)
            )
        `);
        
        // Insert sample timetable data
        const sampleData = [
            ['DPG621S', 'DPG', 'Monday', '07:30', '08:30', 'Room: D3/G/AUD 1(272)', 'Mr. G.K Kapuire'],
            ['MCI521S', 'MCI', 'Monday', '10:30', '11:30', 'Room: D3/G/AUD 1(272)', 'MR.A. KACHEPA'],
            ['PRG510S', 'PRG', 'Monday', '14:00', '15:00', 'Room: D3/G/AUD 1(272)', 'MR. M.KALE'],
            ['MCI521S', 'MCI', 'Tuesday', '09:30', '10:30', 'Room: D3/G/AUD 3(54)', 'MR Sebastian'],
            ['COA511S', 'COA', 'Tuesday', '11:30', '12:00', 'D3/LG/FCI lab9(25)', 'MR. J. W. Silaa'],
            ['DSA521S', 'DSA', 'Tuesday', '15:00', '16:00', 'Room: K7/G/114(40)ET', 'MR. N.Indongo'],
            ['PRG510S', 'PRG', 'Tuesday', '16:00', '17:00', 'Room: D3/G/AUD 1(272)', 'MR. M.KALE'],
            ['MCI521S', 'MCI', 'Wednesday', '07:30', '08:30', 'Room: D3/G/AUD 3(54)', 'MR Sebastian'],
            ['COA511S', 'COA', 'Wednesday', '09:30', '10:30', 'D3/LG/FCI lab9(25)', 'MR. J. W. Silaa'],
            ['DSA521S', 'DSA', 'Wednesday', '14:00', '15:00', 'Room: K7/G/114(40)ET', 'MR. N.Indongo'],
            ['PRG510S', 'PRG', 'Wednesday', '15:00', '16:00', 'Room: D3/G/AUD 1(272)', 'MR. M.KALE'],
            ['DPG621S', 'DPG', 'Thursday', '10:30', '11:30', 'Room: A17/1/FCI LAB7(23)', 'Mr. M.Kasaona'],
            ['MCI521S', 'MCI', 'Thursday', '13:00', '14:00', 'Room: D3/G/AUD 3(54)', 'MR. Sebastian'],
            ['PRG510S', 'PRG', 'Thursday', '16:00', '17:00', 'Room: A17/1/FCI LAB1(28)', 'MR. M.KALE'],
            ['EPR511S', 'EPR511S', 'Friday', '10:30', '11:30', 'Room: A17/1/LL1(35)', 'Mr.LB Kamwi']
        ];
        
        for (const data of sampleData) {
            await db.execute(
                'INSERT IGNORE INTO timetable (course_name, course_code, day_of_week, start_time, end_time, room, lecturer) VALUES (?, ?, ?, ?, ?, ?, ?)',
                data
            );
        }
        
        res.json({ message: 'Timetable created successfully with sample data!' });
        
    } catch (error) {
        console.error('Error creating timetable:', error);
        res.status(500).json({ error: 'Failed to create timetable' });
    }
});

// Fallback data function
function getFallbackData() {
    return {
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
            { time: '16:00 - 17:00', course: 'PRG510S', code: 'PRG', lecturer: 'MR. M.KALE', venue: 'Room: A17/1/FCI LAB1(28)', type: 'Theory' }
        ],
        Friday: [
            { time: '10:30 - 11:30', course: 'EPR511S', code: 'EPR511S', lecturer: 'Mr.LB Kamwi', venue: 'Room: A17/1/LL1(35)', type: 'meeting' }
        ]
    };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Timetable API is running',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   http://localhost:${PORT}/api/timetable`);
    console.log(`   http://localhost:${PORT}/api/health`);
    console.log(`   http://localhost:${PORT}/api/create-timetable`);
    console.log(`   http://localhost:${PORT}/api/login`);
});

// User registration API
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, full_name, email, user_type = 'student' } = req.body;
        
        console.log('Registration attempt:', { username, full_name, email });
        
        // Check if user already exists
        const [existingUsers] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        
        // Insert new user
        const [result] = await db.execute(
            'INSERT INTO users (username, password_hash, user_type, full_name, email) VALUES (?, ?, ?, ?, ?)',
            [username, password, user_type, full_name, email]
        );
        
        console.log('User registered successfully:', username);
        
        res.json({ 
            message: 'Registration successful',
            user_id: result.insertId 
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password, userType } = req.body;
        
        console.log('Login attempt:', { username, userType });
        
        // Check if users table exists
        const [userTables] = await db.execute("SHOW TABLES LIKE 'users'");
        if (userTables.length === 0) {
            console.log('Users table not found');
            return res.status(401).json({ error: 'Users table not found' });
        }
        
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ? AND password_hash = ?',
            [username, password]
        );
        
        console.log('Database query result:', rows);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = rows[0];
        
        // Verify user role matches selected role
        if (user.user_type !== userType) {
            return res.status(401).json({ 
                error: `Invalid role selection. Your account is ${user.user_type}, not ${userType}` 
            });
        }
        
        console.log('Login successful for user:', user.username);
        
        res.json({
            id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            user_type: user.user_type,
            email: user.email
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});
const express = require('express');
const mssql = require('mssql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

const dbConfig = {
    server: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wendb',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

const JWT_SECRET = 'jwtSecretKey';
const tokenBlacklist = new Set();

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const jwtToken = token.split(' ')[1];

    if (tokenBlacklist.has(jwtToken)) {
        return res.status(401).json({ message: 'Token has been invalidated.' });
    }

    try {
        const decoded = jwt.verify(jwtToken, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include letters and numbers' });
    }

    try {
        const pool = await mssql.connect(dbConfig);
        const result = await pool
            .request()
            .input('username', mssql.VarChar, email)
            .input('password', mssql.VarChar, password)
            .query(
                'SELECT * FROM login WHERE username = @username AND password = @password'
            );

        if (result.recordset.length > 0) {
            const username = result.recordset[0].username;
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ Login: true, token, user: result.recordset });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/logout', (req, res) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const jwtToken = token.split(' ')[1];
    tokenBlacklist.add(jwtToken);
    res.status(200).send('Logout successful');
});

app.post('/sign-up', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include letters and numbers' });
    }

    try {
        const pool = await mssql.connect(dbConfig);
        await pool
            .request()
            .input('username', mssql.VarChar, email)
            .input('password', mssql.VarChar, password)
            .query(
                'INSERT INTO login (username, password) VALUES (@username, @password)'
            );

        res.json({ success: true, message: 'Sign-up successful' });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const pool = await mssql.connect(dbConfig);
        const result = await pool
            .request()
            .input('email', mssql.VarChar, email)
            .query(
                'SELECT * FROM login WHERE username = @email'
            );

        if (result.recordset.length > 0) {
            const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
            const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'srizan.p@gmail.com',
                    pass: 'dnpcmdvrqjgjjurz'
                }
            });

            const mailOptions = {
                from: 'srizan.p@gmail.com',
                to: email,
                subject: 'Password Reset',
                text: `Click the following link to reset your password: ${resetLink}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).json({ message: 'Error sending email' });
                }
                res.json({ message: 'Password reset email sent' });
            });
        } else {
            res.status(404).json({ message: 'Email not found' });
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include letters and numbers' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;

        const pool = await mssql.connect(dbConfig);
        await pool
            .request()
            .input('email', mssql.VarChar, email)
            .input('password', mssql.VarChar, password)
            .query(
                'UPDATE login SET password = @password WHERE username = @email'
            );

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/home', authenticateJWT, (req, res) => {
    res.json({ message: 'This is the home route', user: req.user });
});

const PORT = process.env.PORT || 1430;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

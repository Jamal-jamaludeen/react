require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const {Pool} = require('pg');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const PORT = 5000;

const jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: process.env.PG_PASSWORD,
    database: "DB"
});

app.use(express.json());
app.use(cors());

const verifytoken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.user = decoded;
        next();
    });
};
app.get('/verify', verifytoken, async (req, res) => {
    res.json({ valid: true }); 
  });

app.get('/',verifytoken, async (req, res) => {
    try {
        const { username } = req.user;
        const query = 'SELECT * FROM users';
        const result = await pool.query(query);
        const users = result.rows;
        res.json(users);
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error' });
    }
});

app.post('/register', async (req, res) => {
    try {
        let { username, password } = req.body;
        username = username.trim();
        password = password.trim();

        const checkquery = 'SELECT * FROM users WHERE username = $1';
        const checkresult = await pool.query(checkquery, [username]);
        if (checkresult.rows.length > 0) {
            return res.json({ message: 'Username already enter' });
        }
        const saltRounds = 10;
        const perPassword = await bcrypt.hash(password, saltRounds);
        const insertquery = 'INSERT INTO users (username, password) VALUES ($1, $2)';
        await pool.query(insertquery, [username, perPassword]);

        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error registering' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        const user = result.rows[0];
        if (!user) {
            return res.status(400).json({ message: 'Invalid username' });
        }
        const correctpassword = await bcrypt.compare(password, user.password);
        if (!correctpassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ username: user.username }, jwtSecret, {expiresIn: '1h'});
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.json({ message: 'logging error' });
    }
});

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
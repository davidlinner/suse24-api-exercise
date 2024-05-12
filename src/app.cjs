const express = require('express');
const passport = require('./passport-config.cjs');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { read, write } = require('./src/tools/json-files');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = 'your_secret_key';
const userDataFile = 'data/users.json';

async function startServer() {
    try {
        const userData = await read(userDataFile);

        app.use((req, res, next) => {
            if (req.path === '/authenticate') return next();
            const token = req.headers['authorization'];
            if (!token) return res.status(401).json({ message: 'Missing authorization token.' });
            try {
                const decoded = jwt.verify(token, jwtSecret);
                req.user = decoded;
                next();
            } catch (error) {
                return res.status(401).json({ message: 'Invalid authorization token.' });
            }
        });

        app.post('/authenticate', async (req, res) => {
            const { username, password } = req.body;

            const user = userData.find(user => user.name === username);

            if (!user) {
                return res.status(401).json({ message: 'Authentication failed. User not found.' });
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
            }

            const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
            res.json({ token });
        });


        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

startServer();

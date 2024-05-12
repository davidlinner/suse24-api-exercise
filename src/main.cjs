const express = require('express');
const app = require('./app.cjs');

const port = process.env.EXERCISE_PORT || 3001;

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

const request = require('supertest');
const app = require('./app.cjs');
const path = require('path');

const absolutePath = path.resolve(__dirname, '../data/questions.json');
console.log(absolutePath);

describe('GET /questions', () => {
    it('responds with JSON containing questions data', async () => {
        const response = await request(app).get('/questions');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('questions');
    });

    it('responds with 500 if unable to read questions data', async () => {
        // Mock the file read operation to simulate an error
        jest.spyOn(require('fs'), 'readFileSync').mockImplementation(() => {
            throw new Error('Unable to read file');
        });

        const response = await request(app).get('/questions');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Internal server error.');
    });
});

describe('POST /game-runs', () => {
    it('creates a new game run and responds with ID', async () => {
        const userData = { username: 'Max', password: '$2b$10$Gh9PsyavKZ3zEI8Fi5uFeuf/VP/RdeAdqD0Mg3tvl2.X6YfM/nGuO' };  // 示例用户数据
        const response = await request(app).post('/game-runs').send(userData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });

    it('responds with 500 if unable to create game run', async () => {
        // Mock the file read operation to simulate an error
        jest.spyOn(require('fs'), 'readFileSync').mockImplementation(() => {
            throw new Error('Unable to read file');
        });

        const userData = { username: 'Max', password: '$2b$10$Gh9PsyavKZ3zEI8Fi5uFeuf/VP/RdeAdqD0Mg3tvl2.X6YfM/nGuO' };  // Example user data
        const response = await request(app).post('/game-runs').send(userData);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Internal server error.');
    });
});

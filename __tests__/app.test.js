const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require('../db/seeds/seed');

const data = require('../db/data/test-data');

afterAll(() => {
    return db.end();
});

beforeEach(() => {
    return seed(data)
});




describe('GET /api/categories', () => {
    test('returns an array of category objects each should have properties slug and description', () => {
        return request(app)
        .get('/api/categories')
        .expect(200).then(({body}) => {
            const { categories } = body;
            expect(Array.isArray(categories)).toBe(true)
            expect(categories).toHaveLength(4);
            expect(categories[0]).toEqual({"description": "Abstact games that involve little luck", "slug": "euro game"})
        });
       
    });
});
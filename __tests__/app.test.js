const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const data = require("../db/data/test-data");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("bad API request", () => {
  test("returns route not found and gives a 404", () => {
    return request(app)
      .get("/api/categorie")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
describe("GET /api/categories", () => {
  test("returns an array of category objects each should have properties slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBeGreaterThan(0);
        expect(categories[0] && typeof categories[0] === "object").toBe(true);
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("returns an array of reviews sorted by the creation date of the reviews (desc) and containing a number of comments column", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;

        expect(Array.isArray(reviews)).toBe(true);
        expect(reviews.length).toBeGreaterThan(0);
        expect(reviews[0] && typeof reviews[0] === "object").toBe(true);
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });

        reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("get reviews by id", () => {
  test("for an api call for a review ID that is given as a non integer, should return 400 and an invalid ID message", () => {
    return request(app)
      .get("/api/reviews/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query review ID must be int");
      });
  });

  test("for an api call for a review_id that is an int but has no response as there are no reviews associated with it ", () => {
    return request(app)
      .get("/api/reviews/78")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review ID not found");
      });
  });

  test("should return associated reviews when given a valid ID", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(Array.isArray(review)).toBe(true);
        expect(review.length).toBe(1);
        expect(review[0] && typeof review[0] === "object").toBe(true);
        expect(review[0].review_id).toBe(2)

        expect(review[0]).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),


        });

      });
  });
});
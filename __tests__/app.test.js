const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const data = require("../db/data/test-data");
const { forEach } = require("../db/data/test-data/categories.js");

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

        expect(review[0]).toMatchObject({
          review_id: 2,
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

describe("get review comments by ID ", () => {
  test("given a valid review_id with comments gives an array of those comments", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBeGreaterThan(1);
        expect(comments[0] && typeof comments[0] === "object").toBe(true);
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            review_id: 3,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });

  test("given an invalid ID should reject with a 400 and a message", () => {
    return request(app)
      .get("/api/reviews/hello/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid query review ID must be int");
      });
  });

  test("given a valid but unused ID invokes check review ID and gives a 404", () => {
    return request(app)
      .get("/api/reviews/36/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review ID not found");
      });
  });

  test("given a valid review with no IDs returns a 204 with no content", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review ID found but no comments attatched");
      });
  });
});

describe("post comments by review ID", () => {
  test("gives an invalid body for posting should result in a status 400 and invalid query message when inc_votes isnt present", () => {
    const newComment = {
      comment_id: 34,
      squirel: 39,
      timmy: "name",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "bad request body should contain an object with the following elements: username, body"
        );
      });
  });

  test("should return a valid new entry having given a valid new comment", () => {
    const newComment = {
      username: "philippaclaire9",
      body: "best game ever",
    };
    return request(app)
      .post("/api/reviews/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;

        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "best game ever",
          review_id: 3,
          votes: 0,
          author: "philippaclaire9",
          created_at: expect.any(String),
        });
      });
  });

  test("using an invalid username the test should return a 404 form the util funciton  ", () => {
    const newComment = {
      username: "daveTheAverageSeminar3GigaChad",
      body: "best game ever",
    };

    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
      });
  });
});

describe("patching review votes", () => {
  test("checking the review exists", () => {
    const newVotes = {
      inc_votes: 22,
    };

    return request(app)
      .patch("/api/reviews/4324")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review ID not found");
      });
  });

  test("checking review ID is an integer", () => {
    const newVotes = {
      inc_votes: 22,
    };

    return request(app)
      .patch("/api/reviews/sfsfs")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("review ID must be an integer");
      });
  });

  test("testing if inc votes is of the correct data type", () => {
    const newVotes = {
      inc_votes: "hellow",
    };

    return request(app)
      .patch("/api/reviews/4")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("inc votes must be of type: integer");
      });
  });


  test("testing if given a valid request and a valid inc votes positivley increments the votes and returns it ", () => {
    const newVotes = {
      inc_votes: 34,
    };

    return request(app)
      .patch("/api/reviews/4")
      .send(newVotes)
      .expect(202)
      .then(({ body }) => {
        const { review } = body;

       

        expect(review && typeof review === "object").toBe(true);

        expect(review).toMatchObject({
          review_id: 4,
          votes: 41,
          title: expect.any(String)
        });
      });
  });


  test("when given a negative number it decreases the number of votes ", () => {
    const newVotes = {
      inc_votes: -2,
    };

    return request(app)
      .patch("/api/reviews/4")
      .send(newVotes)
      .expect(202)
      .then(({ body }) => {
        const { review } = body;

       

        expect(review && typeof review === "object").toBe(true);

        expect(review).toMatchObject({
          review_id: 4,
          votes: 5,
          title: expect.any(String)
        });
      });
  });
});

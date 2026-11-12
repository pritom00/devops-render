const request = require("supertest");
const app = require("../src/app");

describe("API", () => {
  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("POST /items creates an item", async () => {
    const res = await request(app).post("/items").send({ name: "test" });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("test");
  });

  test("POST /items validates input", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });

  test("GET /metrics exposes Prometheus metrics", async () => {
    const res = await request(app).get("/metrics");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("http_request_duration_seconds");
  });
});

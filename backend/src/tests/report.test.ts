// @ts-nocheck
import request from "supertest";
import app from "../app.js";

describe("Report endpoints - smoke tests", () => {
  it("should return 200 for health check", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});

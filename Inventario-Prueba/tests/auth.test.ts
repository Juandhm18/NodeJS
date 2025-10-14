import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/config/database";
import { User } from "../src/models/user.model";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({ username: "admin", password: "admin123", role: "admin" });
});

describe("Auth Tests", () => {
  it("debería iniciar sesión correctamente", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("x-api-key", process.env.API_KEY!)
      .send({ username: "admin", password: "admin123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("debería fallar con credenciales incorrectas", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("x-api-key", process.env.API_KEY!)
      .send({ username: "admin", password: "incorrecto" });

    expect(res.status).toBe(401);
  });
});

afterAll(async () => {
  await sequelize.close();
});
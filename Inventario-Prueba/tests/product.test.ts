import request from "supertest";
import app from "../src/app";
import { sequelize } from "../src/config/database";
import bcrypt from "bcrypt";
import { User } from "../src/models/user.model";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

let token: string;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await User.create({ username: "admin", password: "admin123", role: "admin" });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ username: "admin", password: "admin123" });

  token = res.body.token;
});

describe("Product Tests", () => {
  it("debería crear un nuevo producto", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Tornillos", code: "P001", stock: 50 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("debería listar los productos", async () => {
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

afterAll(async () => {
  await sequelize.close();
});

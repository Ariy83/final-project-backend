import mongoose from "mongoose";
import request from "supertest";
import app from "../app";
import User from "../models/User";

const { DB_HOST } = process.env;

describe("test /users/login", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(4000);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(() => {});

  afterEach(() => {});

  test("test responce", async () => {
    const loginData = {
      email: "AndriiSauliak@gmail.com",
      password: "AndriiSauliak",
    };

    const { statusCode, body } = await request(app)
      .post("/users/login")
      .send(loginData);

    expect(statusCode).toBe(200);
    expect(body.token).toBeTruthy();
    expect(body.user).toMatchSnapshot({
      email: expect.any(String),
      subscription: expect.any(String),
    });

    const testUser = await User.findOne({ email: loginData.email });
    expect(testUser).not.toBeNull();
    expect(testUser.email).toBe(loginData.email);
  });
});

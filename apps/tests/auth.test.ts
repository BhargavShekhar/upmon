import { describe, it, expect } from "bun:test";
import axios from "axios";

const baseUrl = "http://localhost:8080";

describe("Auth routes", () => {
  it("should not sign up without username or password", async () => {
    await expect(axios.post(`${baseUrl}/api/v1/auth/sign-up`, {}))
      .rejects.toMatchObject({
        response: { status: 411 },
      });
  });

  it("should sign up with valid credentials", async () => {
    const response = await axios.post(`${baseUrl}/api/v1/auth/sign-up`, {
      username: "testuser",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("id");
  });

  it("should not sign in with invalid username", async () => {
    await expect(
      axios.post(`${baseUrl}/api/v1/auth/sign-in`, {
        username: "nonexistent",
        password: "password123",
      })
    ).rejects.toMatchObject({
      response: { status: 401 },
    });
  });

  it("should sign in with correct credentials", async () => {
    const response = await axios.post(`${baseUrl}/api/v1/auth/sign-in`, {
      username: "testuser",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("token");
  });

  it("should reject wrong password", async () => {
    await expect(
      axios.post(`${baseUrl}/api/v1/auth/sign-in`, {
        username: "testuser",
        password: "wrongpassword",
      })
    ).rejects.toMatchObject({
      response: { status: 401 },
    });
  });
});

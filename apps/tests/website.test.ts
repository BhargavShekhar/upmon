import axios from "axios"
import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import { BACKEND_URL } from "./utils/config"
import { CreateUser, DeleteUser } from "./utils/testUser";

let baseUrl = BACKEND_URL;

describe("Website gets created", () => {
    let testUser: { username: string, id: string, jwt: string };

    beforeAll(async () => {
        testUser = await CreateUser();
    });

    it("Website not created if url not present", async () => {
        await expect(
            axios.post(`${baseUrl}/api/v1/website`, {}, {
                headers: { Authorization: `Bearer ${testUser.jwt}` }
            })
        ).rejects.toMatchObject({
            response: { status: 400 }
        })
    })

    it("Website created if url is present", async () => {
        const response = await axios.post(`${baseUrl}/api/v1/website`, {
            url: "https://test.com"
        }, {
            headers: { Authorization: `Bearer ${testUser.jwt}` }
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty("id");
    })

    it("Website not created without a auth token", async () => {
        await expect(axios.post(`${baseUrl}/api/v1/website`, {
            url: "https://test.com"
        }, {
            headers: {}
        }))
            .rejects.toMatchObject({
                response: { status: 401 }
            })
    })

    it("Website not created with invalid token type", async () => {
        await expect(axios.post(`${baseUrl}/api/v1/website`, {
            url: "https://test.com"
        }, {
            headers: { Authorization: testUser.jwt }
        }))
            .rejects.toMatchObject({
                response: { status: 401 }
            })
    })

    afterAll(async () => await DeleteUser(testUser.username));
})

describe("Website get fetched", () => {
    let testUser1: { username: string, id: string, jwt: string };
    let testUser2: { username: string, id: string, jwt: string };

    beforeAll(async () => {
        testUser1 = await CreateUser();
        testUser2 = await CreateUser();
    })

    it("Website fetched with correct token", async () => {
        const website = await axios.post(`${BACKEND_URL}/api/v1/website`, {
            url: "https://test.com",
        }, {
            headers: { Authorization: `Bearer ${testUser1.jwt}` }
        })

        expect(website.status).toBe(200);

        const response = await axios.get(`${BACKEND_URL}/api/v1/website/status/${website.data.id}`, {
            headers: { Authorization: `Bearer ${testUser1.jwt}` }
        });

        expect(response.status).toBe(200);
    })

    it("Website not fetched with others token", async () => {
        const website = await axios.post(`${BACKEND_URL}/api/v1/website`, {
            url: "https://test.com",
        }, {
            headers: { Authorization: `Bearer ${testUser1.jwt}` }
        })

        expect(website.status).toBe(200);

        await expect(
            axios.get(`${BACKEND_URL}/api/v1/website/status/${website.data.id}`, {
                headers: { Authorization: `Bearer ${testUser2.jwt}` }
            })
        ).rejects.toMatchObject({
            response: {
                status: 404
            }
        })
    })

    it("Website not fetched with invalid token", async () => {
        const website = await axios.post(`${BACKEND_URL}/api/v1/website`, {
            url: "https://test.com",
        }, {
            headers: { Authorization: `Bearer ${testUser1.jwt}` }
        })

        expect(website.status).toBe(200);

        await expect(
            axios.get(`${BACKEND_URL}/api/v1/website/status/${website.data.id}`, {
                headers: { Authorization: `Bearer invalid.jwt.token` }
            })
        ).rejects.toMatchObject({
            response: {
                status: 401
            }
        })
    })

    afterAll(async () => {
        if (testUser1) await DeleteUser(testUser1.username);
        if (testUser2) await DeleteUser(testUser2.username);
    })
})
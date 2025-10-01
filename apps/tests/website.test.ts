import { describe, expect, it } from "bun:test"
import axios from "axios"

let baseUrl = "http://localhost:8080"

describe("Website gets created", () => {
    it("Website not created if url not present", async () => {
        await expect(axios.post(`${baseUrl}/api/v1/website`, {}))
            .rejects.toMatchObject({
                response: { status: 400 }
            })
    })

    it("Website created if url is present", async () => {
        const response = await axios.post(`${baseUrl}/api/v1/website`, {
            url: "https://test.com"
        });

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty("id");
    })

    it("Website router is working", async () => {
        const response = await axios.get(`${baseUrl}/api/v1/website/test`);

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty("msg");
    })
})
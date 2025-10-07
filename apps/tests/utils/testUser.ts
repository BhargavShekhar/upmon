import axios from "axios"
import { BACKEND_URL } from "./config"
import { prisma } from "@repo/store"

export const CreateUser = async (): Promise<{
    id: string,
    jwt: string,
    username: string
}> => {
    const username = `testuser.${Math.random()}`;
    const password = "password123"

    try {
        const user = await axios.post(`${BACKEND_URL}/api/v1/auth/sign-up`, {
            username,
            password
        })

        const signin = await axios.post(`${BACKEND_URL}/api/v1/auth/sign-in`, {
            username,
            password
        })

        return {
            id: user.data.id,
            jwt: signin.data.token,
            username
        }

    } catch (err: any) {
        if (err.response?.status !== 409) {
            console.error("CreateUser signup error:", err.response?.data || err.message);
            throw err;
        }

        console.error(err);

        throw err;
    }
}

export const DeleteUser = async (username: string) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return;

    await prisma.website.deleteMany({
        where: { user_id: user.id }
    });

    await prisma.user.deleteMany({
        where: { username }
    })
}
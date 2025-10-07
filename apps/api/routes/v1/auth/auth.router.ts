import { Router } from "express";
import { SignInSchema, SignUpSchema } from "./schema";
import { prisma } from "@repo/store";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/sign-up", async (req, res) => {
    const { data, success, error } = SignUpSchema.safeParse(req.body);

    if (!success) {
        console.log(error);
        return res.status(411).json({ msg: "Invalid username or password" });
    }

    const { username, password } = data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        return res.json({ id: user.id });
    } catch (error) {
        console.log("Auth:: sign-up: could not sign up ", error);
        res.status(500).json({ msg: "Please try again later" });
    }
})

router.post("/sign-in", async (req, res) => {
    const { data, success, error } = SignInSchema.safeParse(req.body);

    if (!success) {
        console.log(error);
        return res.status(400).json({ msg: "Invalid username or password" });
    }

    const { username, password } = data;

    try {
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user?.id) return res.status(401).json({ msg: "user not found" });

        const match = await bcrypt.compare(password, user.password);

        if (!match) return res.status(401).json({ msg: "Invalid Password" });

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET!);

        res.json({ token })
    } catch (error) {
        console.log("Auth:: sign-in: could not sign in ", error);
        res.status(500).json({ msg: "Please try again later" });
    }
})

export default router;
import { prisma } from "@repo/store";
import { Router } from "express";
import { websiteUrlSchema } from "./schema";

const router = Router();

router.post("/", async (req, res) => {
    const result = websiteUrlSchema.safeParse(req.body);

    if(!result.success) return res.status(400) .json({ msg: result.error.message })

    try {
        const url = result.data.url;

        const website = await prisma.website.create({
            data: { url }
        })

        return res.json({ id: website.id })
    } catch (error) {
        console.log("website router :: ", error);
        res.status(500).json({ msg: "try again later" })
    }
})

router.get("/test", (req, res) => {
    res.json({ msg: "lol" })
})

export default router; 
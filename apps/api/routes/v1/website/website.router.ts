import { prisma } from "@repo/store";
import { Router } from "express";
import { websiteUrlSchema } from "./schema";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.use(auth);

router.post("/", async (req, res) => {
    const result = websiteUrlSchema.safeParse(req.body);

    if(!result.success) return res.status(400) .json({ msg: result.error.message })

    try {
        const url = result.data.url;

        const website = await prisma.website.create({
            data: {
                url,
                user_id: req.userId!
            }
        })

        return res.json({ id: website.id })
    } catch (error) {
        console.log("Website :: ", error);
        res.status(500).json({ msg: "try again later" })
    }
})

router.get("/status/:websiteId", async (req, res) => {
    try {
        const website = await prisma.website.findFirst({
            where: {
                user_id: req.userId,
                id: req.params.websiteId
            },
            include: {
                ticks: {
                    take: 1,
                    orderBy: {
                        created_at: "desc"
                    }
                }
            }
        })

        if (!website) return res.status(404).json({ msg: "no website found" })
        
        res.json({ website })
    } catch (error) {
        console.log("Website :: website status: ", error);
        res.status(500).json({ msg: "try again later" })
    }
})

export default router; 
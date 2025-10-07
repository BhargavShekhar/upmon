import express from "express"
import websiteRouter from "./routes/v1/website/website.router";
import authRouter from "./routes/v1/auth/auth.router";

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.use("/api/v1/website", websiteRouter);
app.use("/api/v1/auth", authRouter);

app.listen(port, () => {
    console.log(`----- Api Server is up on port ${port} -----`)
})
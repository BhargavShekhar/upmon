import express from "express"
import websiteRouter from "./routes/v1/website.router";

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());

app.use("/api/v1/website", websiteRouter);

app.listen(port, () => {
    console.log(`----- Api Server is up on port ${port} -----`)
})
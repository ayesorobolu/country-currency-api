import express from "express";
import dotenv from "dotenv";
import countriesRouter from "./routes/countriesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3050

app.use(express.json());

app.get("/", (req, res) => {
    res.send("hi")
})

app.use("/countries", countriesRouter);

app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})
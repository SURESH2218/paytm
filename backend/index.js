import connectDB from "./db/db.js";

import express from "express";
import mainRouter from "./routes/index.js";
const app = express();
app.use(express.json());
connectDB();

app.use("api/v1", mainRouter);
app.listen(3000);

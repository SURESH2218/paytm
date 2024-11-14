import connectDB from "./db/db.js";
import express from "express";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "process.env.CORS_ORIGIN",
    credentials: true,
  })
);
connectDB();

import mainRouter from "./routes/userRouter.js";
import accountRouter from "./routes/accountRouter.js";
app.use("/api/v1", mainRouter);
app.use("/api/v1", accountRouter);

app.listen(3000);

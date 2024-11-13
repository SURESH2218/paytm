import express from "express";
import { signUpUser } from "../controllers/UserController.js";

const router = express.Router();

router.post("/signup", signUpUser);

export default router;

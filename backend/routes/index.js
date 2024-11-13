import express from "express";
import { signUpUser, singinUser } from "../controllers/UserController.js";

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", singinUser);

export default router;

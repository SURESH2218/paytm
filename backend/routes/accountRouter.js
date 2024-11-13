import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  accountBalance,
  transferAmount,
} from "../controllers/accountController.js";

router.get("/account/balance", authMiddleware, accountBalance);
router.post("/account/transfer", authMiddleware, transferAmount);

export default router;

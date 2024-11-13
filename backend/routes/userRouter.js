import express from "express";
import {
  filterUser,
  signUpUser,
  singinUser,
  updatebody,
} from "../controllers/UserController.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/user/signup", signUpUser);
router.post("/user/signin", singinUser);
router.put("/user/update", authMiddleware, updatebody);
router.get("/users/filterUser", authMiddleware, filterUser);

export default router;

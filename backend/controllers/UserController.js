import zod from "zod";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

export const signUpUser = async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  const { success, error } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: "Validation failed",
      errors: error.errors,
    });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      msg: "Username already taken",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const dbUser = new User({
    username,
    password: hashedPassword,
    firstName,
    lastName,
  });

  try {
    await dbUser.save();
    const token = jwt.sign({ userId: dbUser._id }, process.env.JWT_SECRET);

    return res.status(201).json({
      msg: "User created successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

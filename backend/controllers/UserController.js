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

const signinSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
});

export const signinUser = async (req, res) => {
  const { username, password } = req.body;

  const { success, error } = signinSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      msg: "Validation failed",
      errors: error.errors,
    });
  }

  const user = await User.findOne({
    username,
  });
  if (!user) {
    return res.json({
      msg: "Invalid credentials",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.json({
      msg: "invalid username password ",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET
  );

  return res.status(200).json({
    msg: "User logged in Successfully",
    token,
  });
};

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

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

export const updatebody = async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  const updateData = {};

  if (req.body.password) {
    updateData.password = await bcrypt.hash(req.body.password, 10);
  }
  if (req.body.firstname) updateData.firstname = req.body.firstname;
  if (req.body.lastname) updateData.lastname = req.body.lastname;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({
      message: "No valid fields to update",
    });
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.userId },
    { $set: updateData },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    user: updatedUser,
    message: "Updated successfully",
  });
};

export const filterUser = async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
};

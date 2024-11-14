import mongoose from "mongoose";
import Account from "./account.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
});

userSchema.post("save", async function (doc, next) {
  try {
    const initialBalance = Math.floor(Math.random() * 10000) + 1;
    await Account.create({ userId: doc._id, balance: initialBalance });
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

export default User;

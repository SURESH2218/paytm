import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    tyep: String,
    required: true,
  },
  firstName: String,
  lastName: String,
});

const user = mongoose.model(userSchema, "user");

export default user;

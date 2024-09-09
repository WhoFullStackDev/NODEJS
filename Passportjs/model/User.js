const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: Buffer, required: true },
    salt: Buffer,
  },
  { timestamps: true }
);

exports.User = mongoose.model("User", userSchema);

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";
import { ErrorMessage } from "../utils/messages/messages.js";

const userSchema = mongoose.Schema(
  {
    profilePictureUrl: {
      type: String
    },
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    picture: {
      type: String
    },
    email: {
      type: String,
      // required: true,
      // unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value?.length > 0 && !validator.isEmail(value)) {
          throw new Error(ErrorMessage.invalidEmail);
        }
      }
    },
    password: {
      required: false,
      type: String,
      trim: true,
      private: true
    },
    merchantId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  console.log({ user }, "pre");
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

export default User;

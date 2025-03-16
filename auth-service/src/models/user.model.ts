import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/user.types";
import bcrypt from "bcryptjs";

interface IUserDoc extends IUser, Document {}

const userSchema = new Schema<IUserDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    avatar: String,
    role: {
      type: String,
      enum: ["admin", "customer", "rider", "restaurant_owner"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: String, // optional, if storing in DB
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare Password Method
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = model<IUserDoc>("User", userSchema);

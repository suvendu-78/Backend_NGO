import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      lowercase: true,
    },

    Email: {
      type: String,
      required: true,
    },

    Mobile: {
      type: Number,
      required: true,
    },

    Password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    avatar: {
      type: String,
    },

    createdByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    Refresh_token: {
      type: String,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("Password")) {
      this.Password = await bcrypt.hash(this.Password, 10);
    }
    next();
  } catch (error) {
    console.log("Error", error);
  }
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  const compair = await bcrypt.compare(password, this.Password);
  return compair;
};

UserSchema.methods.ACCESS_TOKEN = function () {
  return jwt.sign(
    {
      _id: this._id,
      Email: this.Email,
      Name: this.Email,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

UserSchema.methods.REFRESH_TOKEN = function () {
  return jwt.sign(
    {
      _id: this._id,
      Email: this.Email,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: process.env.Refresh_TOKEN_EXPIRY,
    },
  );
};

export const User = mongoose.model("User", UserSchema);

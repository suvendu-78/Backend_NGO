import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobile: {
      type: String,
      //   required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Admin = mongoose.model("Admin", adminSchema);

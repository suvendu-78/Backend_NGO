import mongoose from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
      lowercases: true,
    },
    Email: {
      type: String,
      require: true,
    },
    Mobile: {
      type: Number,
      require: true,
    },
    Password: {
      type: String,
      require: true,
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
      type: String, // cloudinary / image URL
    },
    createdByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    description: {
      type: String,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    pdfPublicId: {
      type: String, // cloudinary public_id
    },
    price: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    Refresh_token: {
      type: String,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);

UserSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    this.Password = await bcrypt.hash(this.Password, 10);
  }
  next();
});

UserSchema.methods.ispasswordCorrect = async function (password) {
  const compair = bcrypt.compare(this.Password, password);
};

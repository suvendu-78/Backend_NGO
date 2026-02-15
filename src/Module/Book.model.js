import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    // 📄 PDF
    pdfUrl: {
      type: String,
    },
    pdfPublicId: {
      type: String,
    },
    type: {
      type: String,
      enum: ["ebook", "book"],
      required: true,
    },

    // 🖼️ Book Cover Image
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },

    price: {
      type: Number,
      default: 0,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      default: "Draft",
    },
    author: {
      type: String,
    },

    imei: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Book = mongoose.model("Book", BookSchema);

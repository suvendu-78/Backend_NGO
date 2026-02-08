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

    pdfUrl: {
      type: String,
    },

    pdfPublicId: {
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
  },
  { timestamps: true },
);

export const Book = mongoose.model("Book", BookSchema);

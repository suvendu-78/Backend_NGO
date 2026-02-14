// import mongoose from "mongoose";

// const SchemaOrder = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     book: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Book",
//       required: true,
//     },

//     quantity: {
//       type: Number,
//       default: 1,
//     },

//     totalPrice: {
//       type: Number,
//       required: true,
//     },
//     address: {
//       fullName: String,
//       phone: String,
//       city: String,
//       state: String,
//       pincode: String,
//       country: String,
//       street: String,
//     },

//     status: {
//       type: String,
//       enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
//       default: "Pending",
//     },
//   },
//   { timestamps: true },
// );

// export const Order = mongoose.model("Order", SchemaOrder);

// import mongoose from "mongoose";

// const SchemaOrder = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     books: [
//       {
//         book: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Book",
//           required: true,
//         },

//         name: {
//           type: String,
//           required: true,
//         },

//         price: {
//           type: Number,
//           required: true,
//         },

//         quantity: {
//           type: Number,
//           default: 1,
//         },
//       },
//     ],

//     totalBooks: {
//       type: Number,
//       required: true,
//     },

//     totalPrice: {
//       type: Number,
//       required: true,
//     },

//     address: {
//       fullName: String,
//       phone: String,
//       city: String,
//       state: String,
//       pincode: String,
//       country: String,
//       street: String,
//     },

//     status: {
//       type: String,
//       enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
//       default: "Pending",
//     },
//   },
//   { timestamps: true },
// );

// export const Order = mongoose.model("Order", SchemaOrder);

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },

    books: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalBooks: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentId: {
      type: String,
    },

    address: {
      fullName: String,
      phone: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      street: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", OrderSchema);

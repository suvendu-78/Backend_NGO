import { Order } from "../Module/Order.model.js";
import { Book } from "../Module/Book.model.js";
import Async from "../Utils/Async.js";
import SendMail from "../Utils/sendMail.js";

// const CreateOrder = Async(async (req, res) => {
//   console.log("CreateOrder API HIT 🚀");

//   const { books, address, paymentId } = req.body;
//   console.log(address, books, paymentId);
//   const { userId } = req.auth();
//   // ✅ Validate books
//   if (!books || books.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "No books selected",
//     });
//   }

//   // ✅ Validate address
//   if (!address || !address.fullName || !address.phone) {
//     return res.status(400).json({
//       success: false,
//       message: "Address details are required",
//     });
//   }

//   let totalPrice = 0;
//   let totalBooks = 0;

//   // 🔥 Fetch all books at once (better performance)
//   const bookDetails = await Promise.all(
//     books.map((item) => Book.findById(item.bookId)),
//   );

//   const orderBooks = [];

//   for (let i = 0; i < books.length; i++) {
//     const bookData = bookDetails[i];

//     if (!bookData) {
//       return res.status(404).json({
//         success: false,
//         message: "One of the books not found",
//       });
//     }

//     const quantity = books[i].quantity || 1;

//     totalBooks += quantity;
//     totalPrice += bookData.price * quantity;

//     orderBooks.push({
//       book: bookData._id,
//       name: bookData.title,
//       price: bookData.price,
//       quantity,
//     });
//   }

//   // ✅ Create order only after payment success
//   const order = await Order.create({
//     user: userId, // 🔥 Clerk userId
//     books: orderBooks,
//     totalBooks,
//     totalPrice,
//     paymentId, // store Razorpay/Stripe payment id
//     address,
//     status: "Pending",
//   });

//   // Send Email
//   try {
//     const data = await SendMail({
//       to: process.env.ADMIN_EMAIL,
//       subject: "📚 New Order Received",
//       html: `<h2>Order ID: ${order._id}</h2>`,
//     });
//     console.log(data);
//   } catch (err) {
//     console.log("Email failed:", err.message);
//   }

//   // Response

//   res.status(201).json({
//     success: true,
//     message: "Order placed successfully ✅",
//     order,
//   });
// });

// export default CreateOrder;

const CreateOrder = Async(async (req, res) => {
  console.log("CreateOrder API HIT 🚀");

  const { books, address, paymentId } = req.body;
  const { userId } = req.auth;

  console.log(userId);
  console.log(address, books, paymentId);

  if (!books || books.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No books selected",
    });
  }

  if (!address || !address.fullName || !address.phone) {
    return res.status(400).json({
      success: false,
      message: "Address details are required",
    });
  }

  let totalPrice = 0;
  let totalBooks = 0;

  const bookDetails = await Promise.all(
    books.map((item) => Book.findById(item.bookId)),
  );

  const orderBooks = [];

  for (let i = 0; i < books.length; i++) {
    const bookData = bookDetails[i];

    if (!bookData) {
      return res.status(404).json({
        success: false,
        message: "One of the books not found",
      });
    }

    const quantity = books[i].quantity || 1;

    totalBooks += quantity;
    totalPrice += bookData.price * quantity;

    orderBooks.push({
      book: bookData._id,
      name: bookData.title,
      price: bookData.price,
      quantity,
    });
  }

  const order = await Order.create({
    user: userId,
    books: orderBooks,
    totalBooks,
    totalPrice,
    paymentId,
    address,
    status: "Pending",
  });

  try {
    await SendMail({
      to: process.env.ADMIN_EMAIL,
      subject: "📚 New Order Received",
      html: `<h2>Order ID: ${order._id}</h2>`,
    });
  } catch (err) {
    console.log("Email failed:", err.message);
  }

  return res.status(201).json({
    success: true,
    message: "Order placed successfully ✅",
    order,
  });
});

export default CreateOrder;

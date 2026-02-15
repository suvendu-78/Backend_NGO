// import { Order } from "../Module/Order.model.js";
// import { Book } from "../Module/Book.model.js";
// import Async from "../Utils/Async.js";
// import SendMail from "../Utils/sendMail.js";

// const CreateOrder = Async(async (req, res) => {
//   console.log("CreateOrder API HIT suvendu 🚀");

//   const { books, address, paymentId, productType } = req.body;
//   const userId = req.user._id;

//   console.log(userId);
//   console.log(address, books, paymentId, productType);

//   if (!books || books.length === 0) {
//     return res.status(400).json({
//       success: false,
//       message: "No books selected",
//     });
//   }

//   if (!address || !address.fullName || !address.phone) {
//     return res.status(400).json({
//       success: false,
//       message: "Address details are required",
//     });
//   }

//   let totalPrice = 0;
//   let totalBooks = 0;

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

//   const order = await Order.create({
//     user: userId,
//     books: orderBooks,
//     totalBooks,
//     totalPrice,
//     paymentId,
//     address,
//     status: "Pending",
//   });
//   // ✅ SEND MAIL TO USER (SIMPLE VERSION)
//   try {
//     await SendMail({
//       to: address.email,
//       subject: "📦 Order Placed Successfully",
//       html: `
//       <h3>Hello ${address.fullName || "User"}</h3>
//       <p>Your order has been placed successfully 🎉</p>

//       <h4>📚 Books:</h4>
//       <ul>
//         ${order.books
//           .map(
//             (b) => `
//             <li>
//               ${b.name} - ₹${b.price} × ${b.quantity} = ₹${b.price * b.quantity}
//             </li>
//           `,
//           )
//           .join("")}
//       </ul>

//       <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>

//       <br/>
//       <p>Thank you for ordering with us ❤️</p>
//     `,
//     });
//   } catch (err) {
//     console.log("Email error:", err.message);
//   }

//   return res.status(201).json({
//     success: true,
//     message: "Order placed successfully ✅",
//     order,
//   });
// });

// export default CreateOrder;

import { Order } from "../Module/Order.model.js";
import { Book } from "../Module/Book.model.js";
import Async from "../Utils/Async.js";
import SendMail from "../Utils/sendMail.js";

const CreateOrder = Async(async (req, res) => {
  console.log("CreateOrder API HIT 🚀");

  const { books, address, paymentId } = req.body;
  const userId = req.user._id;

  console.log(address);
  if (!books || books.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No books selected",
    });
  }

  if (!address || !address.fullName || !address.phone || !address.email) {
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

  // ================= USER EMAIL =================
  try {
    await SendMail({
      to: address.email,
      subject: "📦 Order Placed Successfully",
      html: `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- HEADER -->
      <div style="background:linear-gradient(90deg,#ff7a18,#ffb347); color:white; padding:20px; text-align:center;">
        <h2 style="margin:0;">🎉 Order Placed Successfully</h2>
      </div>

      <!-- BODY -->
      <div style="padding:20px; color:#333;">
        
        <h3 style="margin-top:0;">Hello ${address.fullName}</h3>
        <p>Your order has been placed successfully 🎉</p>

        <h3 style="margin-top:20px; color:#ff7a18;">📚 Books Ordered</h3>
        <ul style="padding-left:20px;">
          ${order.books
            .map(
              (b) => `
                <li style="margin-bottom:8px;">
                  <strong>${b.name}</strong><br/>
                  ₹${b.price} × ${b.quantity} = <b>₹${b.price * b.quantity}</b>
                </li>
              `,
            )
            .join("")}
        </ul>

        <hr/>

        <h2 style="color:#28a745;">💰 Total Price: ₹${order.totalPrice}</h2>

        <p style="margin-top:20px;">Thank you for ordering with us ❤️</p>

      </div>

      <!-- FOOTER -->
      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
        <p>📚 NGO Book Store</p>
        <p>This is an automated email. Please do not reply.</p>
      </div>

    </div>

  </div>
`,
    });

    console.log("✅ User email sent");
  } catch (err) {
    console.log("❌ User email error:", err.message);
  }

  // ================= ADMIN EMAIL =================
  try {
    await SendMail({
      to: process.env.EMAIL_USER,
      subject: "🆕 New Order Received",
      html: `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- HEADER -->
      <div style="background:linear-gradient(90deg,#4e73df,#1cc88a); color:white; padding:20px; text-align:center;">
        <h2 style="margin:0;">📦 New Order Received</h2>
      </div>

      <!-- BODY -->
      <div style="padding:20px; color:#333;">
        
        <p style="font-size:15px;">A new order has been placed in your store.</p>

        <hr/>

        <p><strong>🆔 Order ID:</strong> ${order._id}</p>
        <p><strong>👤 Customer Name:</strong> ${address.fullName}</p>
        <p><strong>📧 Customer Email:</strong> ${address.email}</p>
        <p><strong>💳 Payment ID:</strong> ${paymentId || "N/A"}</p>

        <h3 style="margin-top:20px; color:#4e73df;">📚 Books Ordered</h3>
        <ul style="padding-left:20px;">
          ${order.books
            .map(
              (b) => `
                <li style="margin-bottom:8px;">
                  <strong>${b.name}</strong><br/>
                  ₹${b.price} × ${b.quantity} = <b>₹${b.price * b.quantity}</b>
                </li>
              `,
            )
            .join("")}
        </ul>

        <h3 style="margin-top:20px; color:#1cc88a;">📍 Delivery Address</h3>
        <p>
          ${address.fullName}<br/>
          ${address.phone}<br/>
          ${address.fullAddress || ""}<br/>
          ${address.pincode || ""}
        </p>

        <hr/>

        <h2 style="color:#e74a3b;">💰 Total Amount: ₹${order.totalPrice}</h2>
        <p><strong>Status:</strong> Paymentsucess</p>

      </div>

      <!-- FOOTER -->
      <div style="background:#f1f1f1; text-align:center; padding:15px; font-size:12px; color:#777;">
        <p>📚 NGO Book Store Admin Panel</p>
        <p>This is an automated notification email</p>
      </div>

    </div>
  </div>
`,
    });

    console.log("✅ Admin email sent for new order");
  } catch (err) {
    console.log("❌ Admin email error:", err.message);
  }

  return res.status(201).json({
    success: true,
    message: "Order placed successfully ✅",
    order,
  });
});

export default CreateOrder;

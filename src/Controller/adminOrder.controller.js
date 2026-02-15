// import { Order } from "../Module/Order.model.js"; // adjust path if needed
// import Async from "../Utils/Async.js";
// import SendMail from "../Utils/sendMail.js";
// // UPDATE ORDER STATUS (ADMIN)
// const UpdateOrderStatus = Async(async (req, res) => {
//   try {
//     const { status } = req.body;

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true },
//     )
//       .populate("user", "email name")
//       .populate("book", "title");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     try {
//       await SendMail({
//         to: process.env.ADMIN_EMAIL,
//         subject: "📚 New Book Order Received",
//         html: `
//         <h2>📦 New Order Received</h2>

//         <p><strong>Order ID:</strong> ${order._id}</p>
//         <p><strong>User ID:</strong> ${order.user}</p>
//         <p><strong>Payment ID:</strong> ${order.paymentId || "N/A"}</p>

//         <h3>📚 Books Ordered:</h3>
//         <ul>
//           ${order.books
//             .map(
//               (b) => `
//             <li>
//               <strong>${b.name}</strong><br/>
//               Price: ₹${b.price}<br/>
//               Quantity: ${b.quantity}<br/>
//               Subtotal: ₹${b.price * b.quantity}
//             </li>
//           `,
//             )
//             .join("")}
//         </ul>

//         <h3>📍 Delivery Address:</h3>
//         <p>
//           Name: ${order.address.fullName}<br/>
//           Phone: ${order.address.phone}<br/>
//           Street: ${order.address.street || ""}<br/>
//           Pincode: ${order.address.pincode || ""}
//         </p>

//         <h3>💰 Order Summary:</h3>
//         <p>Total Books: ${order.totalBooks}</p>
//         <p>Total Price: ₹${order.totalPrice}</p>

//         <p>Status: ${order.status}</p>
//         <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>

//         <hr/>
//         <p>This order was placed from NGO Book Store.</p>
//       `,
//       });
//     } catch (err) {
//       console.log("Email failed:", err.message);
//     }

//     res.json({
//       message: "Order updated",
//       order,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// export default UpdateOrderStatus;

// import { Order } from "../Module/Order.model.js";
// import Async from "../Utils/Async.js";
// import SendMail from "../Utils/sendMail.js";

// const UpdateOrderStatus = Async(async (req, res) => {
//   try {
//     const { status } = req.body;

//     const order = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true },
//     ).populate("user", "email fullName");

//   o
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // ========= SEND EMAIL TO ADMIN WHEN CONFIRMED =========
//     if (status === "Confirmed") {
//       try {
//         await SendMail({
//           to: process.env.ADMIN_EMAIL,
//           subject: "📚 New Order Confirmed",
//           html: `
//             <h2>✅ Order Confirmed</h2>

//             <p><strong>Order ID:</strong> ${order._id}</p>
//             <p><strong>User Name:</strong> ${order.user.fullName}</p>
//             <p><strong>User Email:</strong> ${order.user.email}</p>
//             <p><strong>Payment ID:</strong> ${order.paymentId || "N/A"}</p>

//             <h3>📚 Books:</h3>
//             <ul>
//               ${order.books
//                 .map(
//                   (b) => `
//                     <li>
//                       ${b.name} - ₹${b.price} × ${b.quantity} = ₹${b.price * b.quantity}
//                     </li>
//                   `,
//                 )
//                 .join("")}
//             </ul>

//             <h3>📍 Address:</h3>
//             <p>
//               ${order.address.fullName}<br/>
//               ${order.address.phone}<br/>
//               ${order.address.street || ""}<br/>
//               ${order.address.pincode || ""}
//             </p>

//             <h3>💰 Total: ₹${order.totalPrice}</h3>
//             <p>Status: ${order.status}</p>
//           `,
//         });

//         console.log("✅ Admin email sent");
//       } catch (err) {
//         console.log("❌ Admin email error:", err.message);
//       }
//     }

//     res.json({
//       message: "Order updated successfully",
//       order,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// export default UpdateOrderStatus;

import { Order } from "../Module/Order.model.js";
import Async from "../Utils/Async.js";
import SendMail from "../Utils/sendMail.js";

const UpdateOrderStatus = Async(async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("user", "email fullName");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ SEND EMAIL TO ADMIN WHEN CONFIRMED
    if (status === "Confirmed") {
      try {
        await SendMail({
          to: process.env.ADMIN_EMAIL,
          subject: "✅ Order Confirmed",
          html: `
            <h2>✅ Order Confirmed</h2>

            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>User Name:</strong> ${order.user.fullName}</p>
            <p><strong>User Email:</strong> ${order.user.email}</p>

            <h3>💰 Total: ₹${order.totalPrice}</h3>
            <p>Status: ${order.status}</p>
          `,
        });

        console.log("✅ Admin confirmation email sent");
      } catch (err) {
        console.log("❌ Admin email error:", err.message);
      }
    }

    res.json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default UpdateOrderStatus;

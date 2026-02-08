import { Order } from "../Module/Order.model.js"; // adjust path if needed
import Async from "../Utils/Async.js";
import SendMail from "../Utils/sendMail.js";
// UPDATE ORDER STATUS (ADMIN)
const UpdateOrderStatus = Async(async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    )
      .populate("user", "email name")
      .populate("book", "title");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    try {
      await SendMail({
        to: order.user.email,
        subject: "📦 Order Status Updated",
        html: `
          <h3>Hello ${order.user.name || "User"}</h3>
          <p>Your order status has been updated.</p>
          <p><b>Book:</b> ${order.book.title}</p>
          <p><b>Status:</b> ${status}</p>
          <br/>
          <p>Thank you for ordering with us ❤️</p>
        `,
      });
    } catch (err) {
      console.log("Email error:", err.message);
    }

    res.json({
      message: "Order updated",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default UpdateOrderStatus;

import { Order } from "../Module/Order.model.js"; // adjust path if needed
import Async from "../Utils/Async.js";

// UPDATE ORDER STATUS (ADMIN)
const UpdateOrderStatus = Async(async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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

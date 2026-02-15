import { Order } from "../Module/Order.model.js";
import Async from "../Utils/Async.js";

const GetAllOrders = Async(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "email name")
    .populate("books.book", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

export default GetAllOrders;

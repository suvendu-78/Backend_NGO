import { Order } from "../Module/Order.model.js";
import Async from "../Utils/Async.js";

const CreateOrder = Async(async (req, res) => {
  const { bookId, address } = req.body;

  const order = await Order.create({
    user: req.user._id,
    book: bookId,
    address,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

export default CreateOrder;

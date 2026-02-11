// import { Order } from "../Module/Order.model.js";
// import Async from "../Utils/Async.js";

// const CreateOrder = Async(async (req, res) => {
//   const { bookId, address } = req.body;

//   const order = await Order.create({
//     user: req.user._id,
//     book: bookId,
//     address,
//   });

//   res.status(201).json({
//     success: true,
//     order,
//   });
// });

// export default CreateOrder;

import { Order } from "../Module/Order.model.js";
import { Book } from "../Module/Book.model.js"; // import book model
import Async from "../Utils/Async.js";

const CreateOrder = Async(async (req, res) => {
  const { books, address } = req.body;

  if (!books || books.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No books selected",
    });
  }

  let totalPrice = 0;
  let totalBooks = 0;

  const orderBooks = [];

  for (let item of books) {
    const bookData = await Book.findById(item.bookId);

    if (!bookData) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const quantity = item.quantity || 1;

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
    user: req.user._id,
    books: orderBooks,
    totalBooks,
    totalPrice,
    address,
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

export default CreateOrder;

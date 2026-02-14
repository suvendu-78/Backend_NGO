import { Order } from "../Module/Order.model.js";
import { Book } from "../Module/Book.model.js";
import Async from "../Utils/Async.js";
import SendMail from "../Utils/sendMail.js";

const CreateOrder = Async(async (req, res) => {
  console.log("CreateOrder API HIT suvendu 🚀");

  const { books, address, paymentId, productType } = req.body;
  const userId = req.user._id;

  console.log(userId);
  console.log(address, books, paymentId, productType);

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
      to: order.user.email,
      subject: "📦 Order Status Updated",
      html: `
          <h3>Hello ${order.user.name || "User"}</h3>
          <p>Your order status has been updated.</p>
          <p><b>Book:</b> ${order.books.title}</p>
        
          <br/>
          <p>Thank you for ordering with us ❤️</p>
        `,
    });
  } catch (err) {
    console.log("Email error:", err.message);
  }
  return res.status(201).json({
    success: true,
    message: "Order placed successfully ✅",
    order,
  });
});

export default CreateOrder;

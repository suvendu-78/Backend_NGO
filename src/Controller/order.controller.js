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
      to: process.env.ADMIN_EMAIL,
      subject: "📚 New Book Order Received",
      html: `
    <h2>📦 New Order Received</h2>

    <p><strong>Order ID:</strong> ${order._id}</p>
    <p><strong>User ID:</strong> ${order.user}</p>
    <p><strong>Payment ID:</strong> ${order.paymentId || "N/A"}</p>

    <h3>📚 Books Ordered:</h3>
    <ul>
      ${order.books
        .map(
          (b) => `
        <li>
          <strong>${b.name}</strong><br/>
          Price: ₹${b.price}<br/>
          Quantity: ${b.quantity}<br/>
          Subtotal: ₹${b.price * b.quantity}
        </li>
      `,
        )
        .join("")}
    </ul>

    <h3>📍 Delivery Address:</h3>
    <p>
      Name: ${order.address.fullName}<br/>
      Phone: ${order.address.phone}<br/>
      Street: ${order.address.street || ""}<br/>
      Pincode: ${order.address.pincode || ""}
    </p>

    <h3>💰 Order Summary:</h3>
    <p>Total Books: ${order.totalBooks}</p>
    <p>Total Price: ₹${order.totalPrice}</p>

    <p>Status: ${order.status}</p>
    <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>

    <hr/>
    <p>This order was placed from NGO Book Store.</p>
  `,
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

import { Router } from "express";
import { Register } from "../Controller/controller.js";
import { Login } from "../Controller/controller.js";
import UpdateOrderStatus from "../Controller/adminOrder.controller.js";
import RequireAdmin from "../Controller/requireAdmin.js";
// import Uploadfile from "../Middlewire/upload.middleware.js";
import CreateBook from "../Controller/bookcontroller.js";
import CreateOrder from "../Controller/order.controller.js";
import upload from "../Middlewire/upload.middleware.js";
import { Book } from "../Module/Book.model.js";
import { requireAuth } from "@clerk/express";
const router = Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/createOrder").post(CreateOrder);
// router.route("/updateOrderStatus").put(RequireAdmin, UpdateOrderStatus);
router.put("/admin/order/:id", RequireAdmin, UpdateOrderStatus);
// 🔥 GET ALL BOOKS (PUBLIC)
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.post("/order/create", requireAuth(), CreateOrder);
router.route("/admin/upload-book").post(
  upload.fields([
    // RequireAdmin,
    { name: "pdf", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  CreateBook,
);
export { router };

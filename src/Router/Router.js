import { Router } from "express";
import { Register, Login } from "../Controller/controller.js";
import UpdateOrderStatus from "../Controller/adminOrder.controller.js";
import RequireAdmin from "../Controller/requireAdmin.js";
import CreateBook from "../Controller/bookcontroller.js";
import CreateOrder from "../Controller/order.controller.js";
import upload from "../Middlewire/upload.middleware.js";
import { Book } from "../Module/Book.model.js";
import { requireAuth } from "@clerk/express";

const router = Router();

// ================= USER =================
router.post("/register", Register);
router.post("/login", Login);

// ================= ORDER =================
router.post("/order/create", CreateOrder);
// requireAuth()
// ================= ADMIN =================
router.put("/admin/order/:id", RequireAdmin, UpdateOrderStatus);

router.post(
  "/admin/upload-book",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  CreateBook,
);

// ================= BOOKS =================
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

export { router };

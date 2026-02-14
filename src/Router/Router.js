import { Router } from "express";
import { Register, Login } from "../Controller/controller.js";
import UpdateOrderStatus from "../Controller/adminOrder.controller.js";
import CreateBook from "../Controller/bookcontroller.js";
import CreateOrder from "../Controller/order.controller.js";
import upload from "../Middlewire/upload.middleware.js";
import { Book } from "../Module/Book.model.js";
import { registerAdmin, loginAdmin } from "../Controller/requireAdmin.js";

import { RequireAdmin } from "../Middlewire/adminmiddlewire.js";
import { verifyToken } from "../Middlewire/user.middlewire.js";

const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/adminregister", registerAdmin);
router.post("/loginAdmin", loginAdmin);

// user order
router.post("/order/create", verifyToken, CreateOrder);

router.put("/admin/order/:id", verifyToken, RequireAdmin, UpdateOrderStatus);

router.post(
  "/admin/upload-book",
  // verifyToken,
  // RequireAdmin,
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  CreateBook,
);

router.get("/admin/dashboard", verifyToken, RequireAdmin, async (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin Dashboard",
    adminId: req.user.id,
  });
});

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

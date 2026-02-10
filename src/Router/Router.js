import { Router } from "express";
import { Register } from "../Controller/controller.js";
import { Login } from "../Controller/controller.js";
import UpdateOrderStatus from "../Controller/adminOrder.controller.js";
import RequireAdmin from "../Controller/requireAdmin.js";
// import Uploadfile from "../Middlewire/upload.middleware.js";
import CreateBook from "../Controller/bookcontroller.js";
import CreateOrder from "../Controller/order.controller.js";
import upload from "../Middlewire/upload.middleware.js";

const router = Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/createOrder").post(CreateOrder);
// router.route("/updateOrderStatus").put(RequireAdmin, UpdateOrderStatus);
router.put("/admin/order/:id", RequireAdmin, UpdateOrderStatus);
router.route("/admin/upload-book").post(
  upload.fields([
    // RequireAdmin,
    { name: "pdf", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  CreateBook,
);
export { router };

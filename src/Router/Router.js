import { Router } from "express";
import { Register } from "../Controller/controller.js";
import { Login } from "../Controller/controller.js";
import UpdateOrderStatus from "../Controller/adminOrder.controller.js";
import RequireAdmin from "../Module/requireAdmin.js";
import Uploadfile from "../Middlewire/upload.middleware.js";
import CreateBook from "../Controller/bookcontroller.js";
const router = Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/updateOrderStatus").put(RequireAdmin, UpdateOrderStatus);
// router.put("/admin/order/:id", RequireAdmin, UpdateOrderStatus)
router.post(
  "/admin/upload-book",
  RequireAdmin,
  Uploadfile.single("pdf"),
  CreateBook,
);
export { router };

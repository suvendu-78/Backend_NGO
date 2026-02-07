import { Router } from "express";
import { Register } from "../Controller/controller.js";
import { Login } from "../Controller/controller.js";
const router = Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
export { router };

import { Router } from "express";
import { Register } from "../Controller/controller.js";
const router = Router();

router.route("/register").post(Register);

export { router };

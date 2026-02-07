import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { User } from "./Module/module.js";
import { router } from "./Router/Router.js";

// 🔥 Clerk Import
import { ClerkExpressRequireAuth } from "@clerk/express";

dotenv.config();

const App = express();

App.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  }),
);

App.use(express.json({ limit: "10kb" }));
App.use(express.urlencoded({ extended: true }));
App.use(express.static("public"));

// ========================
// PUBLIC ROUTES
// ========================

App.use("/api/v1/user", router);

// Example public route
App.get("/", (req, res) => {
  res.send("Backend running with Clerk 🚀");
});

// ========================
// 🔐 PROTECTED ADMIN ROUTES (CLERK)
// ========================

App.get("/admin-data", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      message: "Protected admin data 👑",
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// GET ALL USERS (OPTIONAL PROTECTED)
// ========================

App.get("/getuser", ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default App;

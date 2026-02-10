// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { clerkMiddleware, requireAuth } from "@clerk/express";

// dotenv.config();

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   }),
// );

// app.use(express.json({ limit: "10kb" }));

// app.use(clerkMiddleware());
// import { router } from "./Router/Router.js";
// app.use("/api/v1/user", router);

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Backend running with Clerk 🚀",
//   });
// });

// app.get("/api/protected", requireAuth(), (req, res) => {
//   res.json({
//     success: true,
//     message: "You are authenticated",
//     userId: req.auth.userId,
//   });
// });

// app.get("/api/admin/books", requireAuth(), async (req, res) => {
//   try {
//     const userId = req.auth.userId;

//     res.json({
//       success: true,
//       message: "Admin Books Route",
//       userId,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

// export default app;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import { router } from "./Router/Router.js";

dotenv.config();

const app = express();

/* =======================
   MIDDLEWARES
======================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json({ limit: "10kb" }));

// Clerk middleware
app.use(clerkMiddleware());

/* =======================
   ROUTES
======================= */

// 🔥 IMPORTANT FIX
app.use("/api/v1/user", router);

/* =======================
   HEALTH CHECK
======================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running with Clerk 🚀",
  });
});

/* =======================
   PROTECTED TEST ROUTE
======================= */

app.get("/api/protected", requireAuth(), (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated ✅",
    userId: req.auth.userId,
  });
});

export default app;

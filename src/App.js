import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { clerkMiddleware, requireAuth } from "@clerk/express";



import { router } from "./Router/Router.js";

dotenv.config();

const app = express();

// app.set("trust proxy", 1);

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json({ limit: "10kb" }));

// Clerk middleware
// app.use(clerkMiddleware({}));

app.use("/api/v1/user", router);

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Backend running with Clerk 🚀",
//   });
// });


app.get("/api/protected", (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated ✅",
    userId: req.auth.userId,
  });
});

export default app;

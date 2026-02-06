import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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

import { router } from "./Router/Router.js";

App.use("/api/v1/user", router);

export default App;

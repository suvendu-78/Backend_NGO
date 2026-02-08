import jwt from "jsonwebtoken";
import { User } from "./module.js"; // adjust path if needed

const RequireAdmin = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check admin role
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }

    // attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid Token" });
  }
};

export default RequireAdmin;

import { Admin } from "../Module/Admin.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔐 REGISTER ADMIN
export const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, adminCode } = req.body;

    // check admin secret code
    if (adminCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({
        message: "Invalid Admin Secret Code",
      });
    }

    const exist = await Admin.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      fullName,
      email,
      password: hashed,
    });

    res.status(201).json({
      message: "Admin Registered Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔐 LOGIN ADMIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password, adminCode } = req.body;

    // verify secret code
    if (adminCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({
        message: "Invalid Admin Code",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );

    res.json({
      message: "Admin Login Success",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// import jwt from "jsonwebtoken";
// import { User } from "../Module/module.js";

// export const loginAdmin = async (req, res) => {
//   try {
//     const { Email, Password, adminSecretCode } = req.body;

//     if (!Email || !Password || !adminSecretCode) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields required",
//       });
//     }

//     if (adminSecretCode !== process.env.ADMIN_SECRET_CODE) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid admin secret code",
//       });
//     }

//     const admin = await User.findOne({ Email });

//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message: "Admin not found",
//       });
//     }

//     const isMatch = await admin.isPasswordCorrect(Password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Wrong password",
//       });
//     }

//     // IMPORTANT: role must be admin
//     const token = jwt.sign(
//       {
//         id: admin._id,
//         role: "admin",
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       },
//     );

//     res.status(200).json({
//       success: true,
//       token,
//       user: {
//         id: admin._id,
//         Email: admin.Email,
//         role: "admin",
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

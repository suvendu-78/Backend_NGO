import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const header = req.headers.authorization;

//   if (!header) {
//     return res.status(401).json({
//       message: "No token provided",
//     });
//   }

//   const token = header.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded;

//     next();
//   } catch (err) {
//     return res.status(401).json({
//       message: "Invalid token",
//     });
//   }
// };

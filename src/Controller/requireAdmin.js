

import { requireAuth, clerkClient } from "@clerk/express";

const RequireAdmin = async (req, res, next) => {
  try {
    //  make sure user is logged in (Clerk)
    requireAuth()(req, res, async () => {
      const clerkUserId = req.auth.userId;

      //  get user from Clerk
      const user = await clerkClient.users.getUser(clerkUserId);

      // check admin role from Clerk metadata
      const role = user.publicMetadata?.role;

      if (role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Admin access only",
        });
      }

      // attach clerk user
      req.user = user;

      next();
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export default RequireAdmin;

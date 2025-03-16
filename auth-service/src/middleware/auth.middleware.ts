import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const authMiddleware = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    // Attach user to request
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next(); // Continue to the next middleware/route
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

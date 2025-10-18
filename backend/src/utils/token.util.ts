import jwt from "jsonwebtoken";

export const generateToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET as string;
  if (!secret) {
    throw new Error("JWT_SECRET is missing from environment variables");
  }

  return jwt.sign({ userId, role }, secret, { expiresIn: "7d" });
};

import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
 async register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role, age, gender, contactNumber, address } = req.body;

    console.log("🩺 Incoming patient data:", { age, gender, contactNumber, address });

    const { user, token } = await authService.registerUser(
      name,
      email,
      password,
      role,
      { age, gender, contactNumber, address }
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    res.status(400).json({ message: error.message });
  }
}


  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.loginUser(email, password);
      res.status(200).json({ message: "Login successful", user, token });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
}

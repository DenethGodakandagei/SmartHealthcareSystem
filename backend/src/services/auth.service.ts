import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import { generateToken } from "../utils/token.util.js";
import { validateEmail, validatePassword } from "../utils/validation.util.js";
import type { IUser } from "../interfaces/user.interface.js";

interface AuthResponse {
  user: IUser;
  token: string;
}

export class AuthService {
  async registerUser(
    name: string,
    email: string,
    password: string,
    role: IUser["role"] = "patient",
  ): Promise<AuthResponse> {
    // Validate inputs
    if (!validateEmail(email)) throw new Error("Invalid email format");
    if (!validatePassword(password))
      throw new Error("Password must be at least 6 characters");

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role);
    return { user, token };
  }

  async loginUser(email: string, password: string): Promise<AuthResponse> {
    // Check user existence
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    // Generate token
    const token = generateToken(user._id.toString(), user.role);
    return { user, token };
  }
}

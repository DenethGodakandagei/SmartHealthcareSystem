import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Patient from "../models/patient.model.js";
import { generateToken } from "../utils/token.util.js";
import { validateEmail, validatePassword } from "../utils/validation.util.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role = "patient" } = req.body;

    if (!validateEmail(email))
      return res.status(400).json({ message: "Invalid email format" });
    if (!validatePassword(password))
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    if (role === "patient") {
      await Patient.create({
        userId: user._id, // Types.ObjectId now typed correctly
        age: 0,
        gender: "Other",
        contactNumber: "",
        address: "",
      });
    }

    const token = generateToken(user._id.toString(), role); // safe now
    res.status(201).json({ message: "User registered successfully", user, token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString(), user.role); // safe
    res.json({ message: "Login successful", user, token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

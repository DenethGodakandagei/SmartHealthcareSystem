import type { Request, Response } from "express";
import * as service from "../services/report.service.js";

export const generate = async (req: Request, res: Response) => {
  try {
    const { title, parameters } = req.body;
    const userId = req.user?.userId;
    const report = await service.generateReport(title, parameters, userId);
    res.status(201).json({ message: "Report generated", report });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

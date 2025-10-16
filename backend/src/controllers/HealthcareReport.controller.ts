import { Request, Response } from 'express'
import * as reportService from '../services/HealthcareReport.service'

export const createReport = async (req: Request, res: Response) => {
  try {
    const report = await reportService.createReport(req.body)
    res.status(201).json(report)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const getAllReports = async (req: Request, res: Response) => {
  try {
    const reports = await reportService.getAllReports()
    res.status(200).json(reports)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getReportById = async (req: Request, res: Response) => {
  try {
    const report = await reportService.getReportById(req.params.id)
    if (!report) return res.status(404).json({ message: 'Report not found' })
    res.status(200).json(report)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateReport = async (req: Request, res: Response) => {
  try {
    const updated = await reportService.updateReport(req.params.id, req.body)
    if (!updated) return res.status(404).json({ message: 'Report not found' })
    res.status(200).json(updated)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteReport = async (req: Request, res: Response) => {
  try {
    const deleted = await reportService.deleteReport(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Report not found' })
    res.status(204).send()
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

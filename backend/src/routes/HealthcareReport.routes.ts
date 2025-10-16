import { Router } from 'express'
import * as reportController from '../controllers/HealthcareReport.controller'

const router = Router()

router.post('/', reportController.createReport)
router.get('/', reportController.getAllReports)
router.get('/:id', reportController.getReportById)
router.put('/:id', reportController.updateReport)
router.delete('/:id', reportController.deleteReport)

export default router

import { Router } from 'express'
import { authenticate } from '../../middleware/auth'
import { TaskController } from '../controller/task.controller'
import { TaskService } from '../service/task.service'
import { TaskRepository } from '../repository/task.repository'

const router = Router()

const repo = new TaskRepository()
const service = new TaskService(repo)
const controller = new TaskController(service)

router.use(authenticate)

router.get('/stats', (req, res) => controller.getStats(req, res))
router.get('/', (req, res) => controller.getAll(req, res))
router.post('/', (req, res) => controller.create(req, res))
router.put('/:id', (req, res) => controller.update(req, res))
router.delete('/:id', (req, res) => controller.delete(req, res))

export default router

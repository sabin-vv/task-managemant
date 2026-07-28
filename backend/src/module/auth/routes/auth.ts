import { Router } from 'express'
import { AuthController } from '../controller/auth.controller'
import { AuthService } from '../service/auth.service'
import { AuthRepository } from '../repository/auth.repository'

const router = Router()

const repo = new AuthRepository()
const service = new AuthService(repo)
const controller = new AuthController(service)

router.post('/register', (req, res) => controller.register(req, res))
router.post('/login', (req, res) => controller.login(req, res))

export default router

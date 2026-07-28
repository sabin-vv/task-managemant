import { Router } from 'express'
import Task from '../model/task.model'
import { authenticate, type AuthRequest } from '../../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', async (req, res) => {
    try {
        const { userId } = req as AuthRequest
        const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 })
        res.json(tasks)
    } catch {
        res.status(500).json({ message: 'Failed to fetch tasks' })
    }
})

router.post('/', async (req, res) => {
    try {
        const { userId } = req as AuthRequest
        const { title, description, status } = req.body
        const task = await Task.create({ title, description, status, user: userId })
        res.status(201).json(task)
    } catch {
        res.status(500).json({ message: 'Failed to create task' })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { userId } = req as AuthRequest
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: userId }, req.body, {
            new: true,
            runValidators: true,
        })
        if (!task) {
            res.status(404).json({ message: 'Task not found' })
            return
        }
        res.json(task)
    } catch {
        res.status(500).json({ message: 'Failed to update task' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { userId } = req as AuthRequest
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: userId })
        if (!task) {
            res.status(404).json({ message: 'Task not found' })
            return
        }
        res.json({ message: 'Task deleted' })
    } catch {
        res.status(500).json({ message: 'Failed to delete task' })
    }
})

export default router

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useSocket } from '../hooks/useSocket'
import { fetchTasks, createTask, updateTask, deleteTask, type Task } from '../api/tasks'
import { getSocket } from '../api/socket'
import Modal from '../shared/components/Modal'
import SearchBar from '../shared/components/SearchBar'
import styles from './Tasks.module.css'

const statusLabel: Record<string, string> = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
}

export default function Tasks() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    useSocket()

    const [tasks, setTasks] = useState<Task[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const editRef = useRef<HTMLInputElement>(null)

    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [formTitle, setFormTitle] = useState('')
    const [formDescription, setFormDescription] = useState('')
    const [formDueDate, setFormDueDate] = useState('')

    useEffect(() => {
        fetchTasks()
            .then(setTasks)
            .catch(() => navigate('/login'))
    }, [navigate])

    useEffect(() => {
        const socket = getSocket()
        if (!socket) return

        const onCreated = (task: Task) => setTasks((prev) => [task, ...prev])
        const onUpdated = (task: Task) => setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)))
        const onDeleted = (id: string) => setTasks((prev) => prev.filter((t) => t._id !== id))

        socket.on('task:created', onCreated)
        socket.on('task:updated', onUpdated)
        socket.on('task:deleted', onDeleted)

        return () => {
            socket.off('task:created', onCreated)
            socket.off('task:updated', onUpdated)
            socket.off('task:deleted', onDeleted)
        }
    }, [])

    const resetForm = () => {
        setEditingTask(null)
        setFormTitle('')
        setFormDescription('')
        setFormDueDate('')
    }

    const handleAdd = useCallback(async () => {
        const trimmed = formTitle.trim()
        if (!trimmed) return
        setModalOpen(false)
        resetForm()
        try {
            const task = await createTask({
                title: trimmed,
                description: formDescription.trim() || undefined,
                dueDate: formDueDate || undefined,
            })
            setTasks((prev) => [task, ...prev])
            toast.success('Task created')
        } catch {
            toast.error('Failed to create task')
            setModalOpen(true)
        }
    }, [formTitle, formDescription, formDueDate])

    const handleUpdate = useCallback(async () => {
        if (!editingTask) return
        const trimmed = formTitle.trim()
        if (!trimmed) return
        setModalOpen(false)
        resetForm()
        try {
            const updated = await updateTask(editingTask._id, {
                title: trimmed,
                description: formDescription.trim() || undefined,
                dueDate: formDueDate || undefined,
            })
            setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
            toast.success('Task updated')
        } catch {
            toast.error('Failed to update task')
            setModalOpen(true)
        }
    }, [editingTask, formTitle, formDescription, formDueDate])

    const handleToggle = useCallback(async (task: Task) => {
        const nextStatus = task.status === 'completed' ? 'pending' : 'completed'
        setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: nextStatus } : t)))
        try {
            await updateTask(task._id, { status: nextStatus })
        } catch {
            setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: task.status } : t)))
        }
    }, [])

    const handleDelete = useCallback(async (id: string) => {
        const prev = tasks
        setTasks((p) => p.filter((t) => t._id !== id))
        try {
            await deleteTask(id)
            toast.success('Task deleted')
        } catch {
            toast.error('Failed to delete task')
            setTasks(prev)
        }
    }, [tasks])

    const startEditing = (task: Task) => {
        setEditingId(task._id)
        setEditTitle(task.title)
    }

    const openEditModal = (task: Task) => {
        setEditingTask(task)
        setFormTitle(task.title)
        setFormDescription(task.description ?? '')
        setFormDueDate(task.dueDate ? task.dueDate.split('T')[0] : '')
        setModalOpen(true)
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditTitle('')
    }

    const saveEditing = useCallback(async () => {
        const id = editingId
        const trimmed = editTitle.trim()
        if (!id || !trimmed) {
            cancelEditing()
            return
        }
        setEditingId(null)
        setEditTitle('')
        try {
            await updateTask(id, { title: trimmed })
        } catch {
            setEditingId(id)
            setEditTitle(trimmed)
        }
    }, [editingId, editTitle])

    useEffect(() => {
        if (editingId && editRef.current) {
            editRef.current.focus()
            editRef.current.select()
        }
    }, [editingId])

    const handleLogout = () => {
        logout()
        toast.success('Logged out')
        navigate('/login')
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const formatDate = (iso: string) => {
        const d = new Date(iso)
        const h = d.getHours()
        const ampm = h >= 12 ? 'PM' : 'AM'
        const pad = (n: number) => String(n).padStart(2, '0')
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${pad(h % 12 || 12)}:${pad(d.getMinutes())} ${ampm}`
    }

    const formatDateOnly = (iso: string) => {
        const d = new Date(iso)
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    }

    const q = search.toLowerCase()
    const filtered = tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description?.toLowerCase() ?? '').includes(q),
    )

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Tasks</h1>
                <div className={styles.userInfo}>
                    {user?.name}
                    <button className={styles.logoutBtn} onClick={() => navigate('/stats')}>
                        Stats
                    </button>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Log out
                    </button>
                </div>
            </div>

            <div className={styles.toolbar}>
                <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." />
                <button
                    className={styles.addBtn}
                    onClick={() => {
                        resetForm()
                        setModalOpen(true)
                    }}
                >
                    + Add Task
                </button>
            </div>

            <Modal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false)
                    resetForm()
                }}
                title={editingTask ? 'Edit Task' : 'New Task'}
            >
                <div className={styles.modalForm}>
                    <input
                        className={styles.modalInput}
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Task title"
                        autoFocus
                    />
                    <textarea
                        className={styles.modalTextarea}
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Description (optional)"
                        rows={3}
                    />
                    <input
                        className={styles.modalInput}
                        type="date"
                        value={formDueDate}
                        onChange={(e) => setFormDueDate(e.target.value)}
                    />
                    <div className={styles.modalActions}>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => {
                                setModalOpen(false)
                                resetForm()
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles.addBtn}
                            onClick={editingTask ? handleUpdate : handleAdd}
                            disabled={!formTitle.trim() || !formDueDate}
                        >
                            {editingTask ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </Modal>

            <div className={styles.taskList}>
                {filtered.length === 0 && (
                    <p className={styles.empty}>
                        {tasks.length === 0 ? 'No tasks yet. Add one above!' : 'No tasks match your search.'}
                    </p>
                )}

                {filtered.map((task) => (
                    <div key={task._id} className={styles.taskCard}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={task.status === 'completed'}
                            onChange={() => handleToggle(task)}
                        />

                        <div className={styles.taskContent}>
                            <div className={styles.taskTitleRow}>
                                {editingId === task._id ? (
                                    <input
                                        ref={editRef}
                                        className={styles.taskTitleInput}
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onBlur={saveEditing}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveEditing()
                                            if (e.key === 'Escape') cancelEditing()
                                        }}
                                    />
                                ) : (
                                    <div
                                        className={`${styles.taskTitle} ${task.status === 'completed' ? styles.taskTitleDone : ''}`}
                                        onClick={() => startEditing(task)}
                                    >
                                        {task.title}
                                    </div>
                                )}
                                <span
                                    className={`${styles.statusBadge} ${task.status === 'pending' ? styles.statusPending : task.status === 'in-progress' ? styles.statusInProgress : styles.statusCompleted}`}
                                >
                                    {statusLabel[task.status]}
                                </span>
                            </div>
                            {task.description && <div className={styles.taskDesc}>{task.description}</div>}
                            <div className={styles.taskDates}>
                                <span className={styles.taskDate}>Created: {formatDate(task.createdAt)}</span>
                                {task.dueDate && <span className={styles.taskDate}>Due: {formatDateOnly(task.dueDate)}</span>}
                            </div>
                        </div>

                        {task.status !== 'completed' && (
                            <button className={styles.editBtn} onClick={() => openEditModal(task)}>
                                <Pencil />
                            </button>
                        )}

                        <button className={styles.deleteBtn} onClick={() => handleDelete(task._id)}>
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

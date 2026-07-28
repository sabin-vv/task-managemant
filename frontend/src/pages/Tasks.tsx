import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../hooks/useSocket'
import { fetchTasks, createTask, updateTask, deleteTask, type Task } from '../api/tasks'
import { getSocket } from '../api/socket'
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
    const [title, setTitle] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const editRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetchTasks()
            .then(setTasks)
            .catch(() => navigate('/login'))
    }, [navigate])

    useEffect(() => {
        const socket = getSocket()
        if (!socket) return

        const onCreated = (task: Task) => setTasks((prev) => [task, ...prev])
        const onUpdated = (task: Task) =>
            setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)))
        const onDeleted = (id: string) =>
            setTasks((prev) => prev.filter((t) => t._id !== id))

        socket.on('task:created', onCreated)
        socket.on('task:updated', onUpdated)
        socket.on('task:deleted', onDeleted)

        return () => {
            socket.off('task:created', onCreated)
            socket.off('task:updated', onUpdated)
            socket.off('task:deleted', onDeleted)
        }
    }, [])

    const handleAdd = useCallback(async () => {
        const trimmed = title.trim()
        if (!trimmed) return
        setTitle('')
        try {
            await createTask({ title: trimmed })
        } catch {
            setTitle(trimmed)
        }
    }, [title])

    const handleToggle = useCallback(async (task: Task) => {
        const nextStatus = task.status === 'completed' ? 'pending' : 'completed'
        await updateTask(task._id, { status: nextStatus })
    }, [])

    const handleDelete = useCallback(async (id: string) => {
        await deleteTask(id)
    }, [])

    const startEditing = (task: Task) => {
        setEditingId(task._id)
        setEditTitle(task.title)
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
        navigate('/login')
    }

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })

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

            <div className={styles.addForm}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Add a new task..."
                />
                <button className={styles.addBtn} onClick={handleAdd}>
                    Add
                </button>
            </div>

            <div className={styles.taskList}>
                {tasks.length === 0 && (
                    <p className={styles.empty}>No tasks yet. Add one above!</p>
                )}

                {tasks.map((task) => (
                    <div key={task._id} className={styles.taskCard}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={task.status === 'completed'}
                            onChange={() => handleToggle(task)}
                        />

                        <div className={styles.taskContent}>
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
                            <div className={styles.taskDate}>{formatDate(task.createdAt)}</div>
                        </div>

                        <span
                            className={`${styles.statusBadge} ${task.status === 'pending' ? styles.statusPending : task.status === 'in-progress' ? styles.statusInProgress : styles.statusCompleted}`}
                        >
                            {statusLabel[task.status]}
                        </span>

                        <button className={styles.deleteBtn} onClick={() => handleDelete(task._id)}>
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

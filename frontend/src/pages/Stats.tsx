import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fetchStats, type TaskStats } from '../api/tasks'
import { useAuth } from '../hooks/useAuth'
import styles from './Stats.module.css'

const STATUS_COLORS: Record<string, string> = {
    pending: '#f59e0b',
    completed: '#10b981',
}

export default function Stats() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState<TaskStats | null>(null)

    useEffect(() => {
        fetchStats()
            .then(setStats)
            .catch(() => navigate('/login'))
    }, [navigate])

    const pieData = stats
        ? [
              { name: 'Pending', value: stats.pending },
              { name: 'Completed', value: stats.completed },
          ].filter((d) => d.value > 0)
        : []

    const barData = stats
        ? [
              { name: 'Pending', count: stats.pending },
              { name: 'Completed', count: stats.completed },
          ]
        : []

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Task Statistics</h1>
                <div>
                    <span style={{ color: 'var(--text)', fontSize: '0.85rem', marginRight: '0.75rem' }}>
                        {user?.name}
                    </span>
                    <button className={styles.backBtn} onClick={() => navigate('/')}>
                        Back to Tasks
                    </button>
                </div>
            </div>

            {stats && (
                <>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.cardLabel}>Total</div>
                            <div className={styles.cardValue}>{stats.total}</div>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardLabel}>Pending</div>
                            <div className={styles.cardValue}>{stats.pending}</div>
                        </div>
                        
                        <div className={styles.card}>
                            <div className={styles.cardLabel}>Completed</div>
                            <div className={styles.cardValue}>{stats.completed}</div>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardLabel}>Overdue</div>
                            <div className={`${styles.cardValue} ${stats.overdue > 0 ? styles.cardValueOverdue : ''}`}>
                                {stats.overdue}
                            </div>
                        </div>
                    </div>

                    <div className={styles.chartsRow}>
                        <div className={styles.chartSection}>
                            <div className={styles.chartTitle}>Status Distribution</div>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                                        {pieData.map((entry) => (
                                            <Cell
                                                key={entry.name}
                                                fill={STATUS_COLORS[entry.name.toLowerCase()]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={styles.chartSection}>
                            <div className={styles.chartTitle}>Task Count by Status</div>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={barData}>
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                        {barData.map((entry) => (
                                            <Cell
                                                key={entry.name}
                                                fill={STATUS_COLORS[entry.name.toLowerCase()]}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

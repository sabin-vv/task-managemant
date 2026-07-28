import { type ReactNode, useEffect } from 'react'
import styles from './Modal.module.css'

type Props = {
    open: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export default function Modal({ open, onClose, title, children }: Props) {
    useEffect(() => {
        if (!open) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [open, onClose])

    if (!open) return null

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    )
}

import { type InputHTMLAttributes, forwardRef, useState } from 'react'
import styles from './Input.module.css'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    error?: string
}

const PasswordField = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...rest }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
        <div className={styles.group}>
            <label className={styles.label}>{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    ref={ref}
                    type={visible ? 'text' : 'password'}
                    className={`${styles.input} ${className ?? ''}`}
                    style={{ paddingRight: '2.75rem' }}
                    {...rest}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text)',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        padding: '0.25rem 0.4rem',
                        fontFamily: 'inherit',
                    }}
                    tabIndex={-1}
                >
                    {visible ? 'Hide' : 'Show'}
                </button>
            </div>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    )
})

PasswordField.displayName = 'PasswordField'
export default PasswordField

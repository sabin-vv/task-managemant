import { type InputHTMLAttributes, forwardRef } from 'react'
import styles from './Input.module.css'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...rest }, ref) => {
    return (
        <div className={styles.group}>
            <label className={styles.label}>{label}</label>
            <input ref={ref} className={`${styles.input} ${className ?? ''}`} {...rest} />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    )
})

Input.displayName = 'Input'
export default Input

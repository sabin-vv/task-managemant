import { type ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean
}

export default function Button({ loading, children, disabled, className, ...rest }: Props) {
    return (
        <button className={`${styles.button} ${className ?? ''}`} disabled={disabled || loading} {...rest}>
            {loading ? 'Loading...' : children}
        </button>
    )
}

import { type InputHTMLAttributes, forwardRef } from 'react'
import fieldStyles from './Field.module.css'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...rest }, ref) => {
    return (
        <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>{label}</label>
            <div className={fieldStyles.wrapper}>
                <input ref={ref} className={`${fieldStyles.input} ${className ?? ''}`} {...rest} />
            </div>
            {error && <span className={fieldStyles.error}>{error}</span>}
        </div>
    )
})

Input.displayName = 'Input'
export default Input

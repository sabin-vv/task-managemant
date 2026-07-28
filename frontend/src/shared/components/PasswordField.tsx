import { type InputHTMLAttributes, forwardRef, useState } from 'react'
import fieldStyles from './Field.module.css'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    error?: string
}

const PasswordField = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...rest }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
        <div className={fieldStyles.group}>
            <label className={fieldStyles.label}>{label}</label>
            <div className={fieldStyles.wrapper}>
                <input
                    ref={ref}
                    type={visible ? 'text' : 'password'}
                    className={`${fieldStyles.input} ${className ?? ''}`}
                    {...rest}
                />
                <button
                    type="button"
                    className={fieldStyles.toggle}
                    onClick={() => setVisible((v) => !v)}
                    tabIndex={-1}
                >
                    {visible ? 'Hide' : 'Show'}
                </button>
            </div>
            {error && <span className={fieldStyles.error}>{error}</span>}
        </div>
    )
})

PasswordField.displayName = 'PasswordField'
export default PasswordField

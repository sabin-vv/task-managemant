import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { loginSchema, type LoginFormData } from '../schemas/auth.schema'
import { useAuth } from '../context/AuthContext'
import Input from '../shared/components/Input'
import PasswordField from '../shared/components/PasswordField'
import Button from '../shared/components/Button'
import styles from './Login.module.css'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [apiError, setApiError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        setApiError('')
        try {
            await login(data.email, data.password)
            navigate('/')
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Login failed')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to your account</p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {apiError && <div className={styles.apiError}>{apiError}</div>}

                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <PasswordField
                        label="Password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                    />

                    <Button type="submit" loading={isSubmitting}>
                        Sign In
                    </Button>
                </form>

                <p className={styles.footer}>
                    Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { signupSchema, type SignupFormData } from '../schemas/auth.schema'
import { useAuth } from '../hooks/useAuth'
import Input from '../shared/components/Input'
import PasswordField from '../shared/components/PasswordField'
import Button from '../shared/components/Button'
import styles from './Signup.module.css'

export default function Signup() {
    const { register: registerUser } = useAuth()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit = async (data: SignupFormData) => {
        try {
            await registerUser(data.name, data.email, data.password)
            toast.success('Account created successfully')
            navigate('/')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Registration failed')
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Sign up to get started</p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Input
                        label="Name"
                        type="text"
                        placeholder="John Doe"
                        error={errors.name?.message}
                        {...register('name')}
                    />

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

                    <PasswordField
                        label="Confirm Password"
                        placeholder="••••••••"
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    <Button type="submit" loading={isSubmitting}>
                        Sign Up
                    </Button>
                </form>

                <p className={styles.footer}>
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

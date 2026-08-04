import { useContext } from 'react'
import { AuthContext } from '../context/auth-context'
import type { AuthContextType } from '../shared/types/types'

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be inside AuthProvider')
    return ctx
}

export const TASK_MESSAGES = {
    FETCH_STATS_FAILED: 'Failed to fetch stats',
    FETCH_TASKS_FAILED: 'Failed to fetch tasks',
    CREATE_FAILED: 'Failed to create task',
    UPDATE_FAILED: 'Failed to update task',
    DELETE_FAILED: 'Failed to delete task',
    NOT_FOUND: 'Task not found',
    DELETED: 'Task deleted',
} as const

export const RESPONSE_MESSAGES = {
    SUCCESS: 'Success',
    CREATED: 'Created',
    FAILED: 'Failed',
    NOT_FOUND: 'Not found',
    UNAUTHORIZED: 'Unauthorized',
    INTERNAL_SERVER_ERROR: 'Internal server error',
} as const

export const AUTH_MESSAGES = {
    REGISTRATION_FAILED: 'Registration failed',
    LOGIN_FAILED: 'Login failed',
    NOT_AUTHENTICATED: 'Not authenticated',
    AUTH_REQUIRED: 'Authentication required',
    INVALID_TOKEN: 'Invalid or expired token',
    EMAIL_EXISTS: 'Email already registered',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    LOGGED_OUT: 'Logged out',
} as const

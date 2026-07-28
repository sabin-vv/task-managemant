import mongoose, { Schema } from 'mongoose'
import type { ITask } from '../../types/task.types'

const taskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    },
    { timestamps: true }
)

export default mongoose.model<ITask>('Task', taskSchema)

import mongoose from "mongoose"

const Schema = mongoose.Schema
const taskSchema = new Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        required: true,
        enum: ["todo", "inProgress", "completed"],
        default: "todo",
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "medium", "high"],
        default: "low"
    },
    dueDate: {
        type: Date
    }
})

export default mongoose.model('Task', taskSchema);
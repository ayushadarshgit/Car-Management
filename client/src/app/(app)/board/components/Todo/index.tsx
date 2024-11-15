import DraggableTaskCard from '@/components/cards/DraggableTaskCard'
import { Task } from '@/types/tasks/index.type'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'

interface TodoProps {
    tasks: Task[]
}

const Todo: React.FC<TodoProps> = ({ tasks }) => {
    const todoTasks = tasks.filter((task) => task.status === "todo");

    return (
        <Droppable droppableId='todo' type='tasks'>
            {
                (provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='flex-1 flex flex-col items-center gap-6'
                    >
                        <h2 className='text-center text-blue-400'>To Do</h2>
                        {
                            todoTasks.length === 0
                                ?
                                <div className='flex-1'>
                                    {provided.placeholder}
                                </div>
                                :
                                <div
                                    className='flex flex-col gap-4 flex-1 items-center w-full'
                                >
                                    {
                                        todoTasks.map((task, index) => {
                                            return (
                                                <DraggableTaskCard className='border-blue-400 shadow-blue-400' key={task._id} {...task} index={index} />
                                            )
                                        })
                                    }
                                    {provided.placeholder}
                                </div>
                        }
                    </div>
                )
            }
        </Droppable>
    )
}

export default Todo
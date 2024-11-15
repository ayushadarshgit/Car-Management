import DraggableTaskCard from '@/components/cards/DraggableTaskCard';
import { Task } from '@/types/tasks/index.type'
import React from 'react'
import { Droppable } from 'react-beautiful-dnd';

interface CompletedProps {
    tasks: Task []
}

const Completed: React.FC<CompletedProps> = ({tasks}) => {
    const completedTasks = tasks.filter((task) => task.status === "completed");

    return (
        <Droppable droppableId='completed' type='tasks'>
            {
                (provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='flex-1 flex flex-col gap-6'
                    >
                        <h2 className='text-center text-green-400'>Completed</h2>
                        {
                            completedTasks.length === 0
                                ?
                                <div className='flex-1'>
                                    {provided.placeholder}
                                </div>
                                :
                                <div
                                    className='flex flex-col gap-4 flex-1'
                                >
                                    {
                                        completedTasks.map((task, index) => {
                                            return (
                                                <DraggableTaskCard className='border-green-400 shadow-green-400' key={task._id} {...task} index={index} />
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

export default Completed
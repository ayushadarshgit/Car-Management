import DraggableTaskCard from '@/components/cards/DraggableTaskCard';
import { Task } from '@/types/tasks/index.type'
import React from 'react'
import { Droppable } from 'react-beautiful-dnd';

interface InProgressProps {
    tasks: Task[]
}

const InProgress: React.FC<InProgressProps> = ({ tasks }) => {
    const inProgressTasks = tasks.filter((task) => task.status === "inProgress");

    return (
        <Droppable droppableId='inProgress' type='tasks'>
            {
                (provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='flex-1 flex flex-col gap-6'
                    >
                        <h2 className='text-center text-yellow-400'>In Progress</h2>
                        {
                            inProgressTasks.length === 0
                                ?
                                <div className='flex-1'>
                                    {provided.placeholder}
                                </div>
                                :
                                <div
                                    className='flex flex-col gap-4 flex-1'
                                >
                                    {
                                        inProgressTasks.map((task, index) => {
                                            return (
                                                <DraggableTaskCard className='border-yellow-400 shadow-yellow-400' key={task._id} {...task} index={index} />
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

export default InProgress
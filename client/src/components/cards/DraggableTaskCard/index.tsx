import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import TaskCard from '../TaskCard'
import { Task } from '@/types/tasks/index.type'

interface DraggableTaskCardProps extends Task {
    index: number,
    className?: string
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({index, className, ...task}) => {
    return (
        <div className="w-full flex flex-col">
            <Draggable key={task._id} draggableId={task._id} index={index}>
                {
                    (provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className='w-full flex justify-center'>
                            <TaskCard {...task} showUpdateOptions={false} className={className} />
                        </div>
                    )
                }
            </Draggable> 
        </div>
    )
}

export default DraggableTaskCard
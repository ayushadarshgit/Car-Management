import React, { HTMLAttributes, useState } from 'react'
import moment from "moment";
import { ChevronDown, ChevronUp, ClipboardCheck, Delete, Hourglass, Pencil, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/tasks/index.type';
import ModalWithIcon from '@/components/modals/ModalWithIcon';
import TaskForm from '@/app/(app)/components/TaskForm';
import { cn, getPriorityColor, getStatusColor } from '@/lib/utils';

interface TaskCardProps extends Task {
    onDelete?: (_id: string) => Promise<void>;
    onEdit?: (task: Task) => void;
    showUpdateOptions?: boolean;
    className?: string;
}   


const TaskCard: React.FC<TaskCardProps> = ({_id, title, description, dueDate, priority, status, onDelete, onEdit, showUpdateOptions = true, className = ""}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);

    const handleDelete = () => {
        onDelete?.(_id);
}

const handleEdit = (task: Task) => {
        onEdit?.(task);
        setEditVisible(false);
    }

    return (
        <div 
            className={cn('shadow-md p-4 border-[1px] cursor-pointer hover:scale-[.98] transition-all border-blue-400 shadow-blue-400 max-w-[500px] rounded-md w-full flex flex-col gap-5', className)}
        >
            <div className='flex flex-row justify-between gap-4'>
                <div className='flex-1 flex flex-row gap-4'>
                    <div className='flex flex-row items-start gap-2'>
                        <ClipboardCheck className='min-w-5 min-h-5 w-5 h-5' />
                        <h3>{title}</h3>
                    </div>
                </div>           
                <div>
                    <div className='flex flex-row gap-2'>
                        {
                            dueDate
                            ?
                            <div className='flex flex-row gap-1 items-center'>
                                <Hourglass className='w-4 h-4' />
                                <p className='text-sm'>{moment(new Date(dueDate)).format("MMM D")}</p>
                            </div>
                            :
                            null
                        }
                        {
                            description
                            ?
                            open
                            ?
                            <ChevronUp className='cursor-pointer hover:text-blue-600' onClick={() => setOpen((prev) => !prev)} />
                            :
                            <ChevronDown className='cursor-pointer hover:text-blue-600' onClick={() => setOpen((prev) => !prev)} />
                            :
                            null
                        }
                    </div>
                </div> 
            </div>  
            {
                description && open
                ?
                <div className={`transition-all duration-1000 overflow-hidden ${open ? "opacity-1": "opacity-0 h-0"}`}>
                    <p>{description}</p>
                </div>
                :
                null
            }
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row gap-3'>
                    <Badge variant="outline" className={getPriorityColor(priority)}>{priority.toUpperCase()}</Badge>
                    <Badge variant="outline" className={getStatusColor(status)}>{status.toUpperCase()}</Badge>
                </div>
                {
                    showUpdateOptions
                    ?
                    <div className='flex flex-row gap-2'>
                        <ModalWithIcon
                            icon={<Pencil className='cursor-pointer w-5 h-5 hover:text-blue-600' />}
                            title='Edit Task'
                            description='Make changes to Edit Task'
                            open={editVisible}
                            setOpen={setEditVisible}                        
                        >
                            <TaskForm 
                                type='edit' 
                                onFinish={handleEdit} 
                                taskId={_id}
                                defaultTitle={title} 
                                defaultDescription={description} 
                                defaultDueDate={dueDate} 
                                defaultPriority={priority} 
                                defaultStatus={status}
                            />
                        </ModalWithIcon>
                        <Trash className='cursor-pointer w-5 h-5 hover:text-red-600' onClick={handleDelete} />
                    </div>
                    :
                    null
                }
            </div>
        </div>
    )
}

export default TaskCard
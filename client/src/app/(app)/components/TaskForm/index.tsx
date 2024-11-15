"use client"
import axiosInstance from '@/api/axiosInstance'
import PrimaryLoader from '@/components/loaders/PrimaryLoader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Task } from '@/types/tasks/index.type'
import moment from 'moment'
import React, { useState } from 'react'

interface taskFormProps {
    type: "create" | "edit";
    onFinish: (task: Task) => void;
    taskId?: string;
    defaultTitle?: string;
    defaultDescription?: string;
    defaultStatus?: "todo" | "inProgress" | "completed" | string;
    defaultPriority?: "low" | "medium" | "high";
    defaultDueDate?: Date | null;
}

const TaskForm: React.FC<taskFormProps> = ({type, onFinish, taskId, defaultTitle, defaultDescription, defaultDueDate, defaultPriority, defaultStatus}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(defaultTitle ? defaultTitle : "");
    const [priority, setPriority] = useState<"low" | "medium" | "high">(defaultPriority ? defaultPriority : "low");
    const [status, setStatus] = useState<"todo" | "inProgress" | "completed" | string>(defaultStatus ? defaultStatus : "todo");
    const [description, setDescription] = useState<string>(defaultDescription ? defaultDescription : "");
    const [dueDate, setDueDate] = useState<string>(defaultDueDate ? moment(defaultDueDate).format("YYYY-MM-D") : "");
    const toast = useToast();

    const handleCreateTask = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post("/tasks/create", {title, priority, status, dueDate, description});
            onFinish(response.data.data);            
            toast.toast({title: response.data.message});
        } catch (err: any) {
            console.log(err);
            if (err?.response?.data?.message) {
                toast.toast({title: err.response.data.message, variant: "destructive"})
            } else {
                toast.toast({title: "Network Error / Server Down", variant: "destructive"})
            }
        } finally {
            setLoading(false);
        }
    } 

    const handleEditTask = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post("/tasks/update/" + taskId, {title, priority, status, dueDate, description});
            onFinish({_id: taskId!, title, priority, status, dueDate: new Date(dueDate), description});
            toast.toast({title: response.data.message});
        } catch (err: any) { 
            console.log(err);
            if (err?.response?.data?.message) {
                toast.toast({title: err.response.data.message, variant: "destructive"})
            } else {
                toast.toast({title: "Network Error / Server Down", variant: "destructive"})
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form 
            className='flex flex-col gap-4' 
            onSubmit={
                type === "create"
                ?
                handleCreateTask
                :
                handleEditTask
            }
        >
            <div className='flex flex-col gap-1'>
                <label htmlFor='title'>Title</label>
                <Input id='title' value={title} onChange={e => setTitle(e.target.value)} required placeholder="Design Frontend" />
            </div>

            <div className='flex flex-col gap-1'>
                <label>Priority</label>
                <div className='flex-row flex flex-wrap justify-between'>
                    <div className="flex items-center space-x-2">
                        <input type='radio' name='priority' defaultChecked={priority === "low"} value="low" onClick={() => setPriority("low")} id="Low" />
                        <label className='text-gray-500 text-sm' htmlFor="Low">Low</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type='radio' name='priority' defaultChecked={priority === "medium"} value="medium" onClick={() => setPriority("medium")} id="Medium" />
                        <label className='text-gray-500 text-sm' htmlFor="Medium">Medium</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type='radio' name='priority' defaultChecked={priority === "high"} value="high" onClick={() => setPriority("high")} id="High" />
                        <label className='text-gray-500 text-sm' htmlFor="High">High</label>
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                <label>Status</label>
                <div className='flex-row flex flex-wrap justify-between'>
                    <div className="flex items-center space-x-2">
                        <input type='radio' name='status' defaultChecked={status === "todo"} value="todo" onClick={() => setStatus("todo")} id="todo" />
                        <label className='text-gray-500 text-sm' htmlFor="todo">To Do</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type='radio' name='status' defaultChecked={status === "inProgress"} value="inProgress" onClick={() => setStatus("inProgress")} id="inProgress" />
                        <label className='text-gray-500 text-sm' htmlFor="inProgress">In Progress</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type='radio' name='status' defaultChecked={status === "completed"} value="completed" onClick={() => setStatus("completed")} id="Completed" />
                        <label className='text-gray-500 text-sm' htmlFor="Completed">Completed</label>
                    </div>
                </div>
            </div>
            
            <div className='flex flex-col gap-1'>
                <label htmlFor='dueDate'>Due Date</label>
                <input type='date' defaultValue={dueDate} onChange={(e) => setDueDate(e.target.value)} className='bg-gray-800 text-gray-400 px-2 py-1' />
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor='description'>Description</label>
                <Textarea id='description' value={description} onChange={e => setDescription(e.target.value)} placeholder='Figma Designs for Home page' />
            </div>

            <Button>
                {
                    loading
                    ?
                    <PrimaryLoader className='w-5 h-5' />
                    :
                    "Submit"
                }
            </Button>
        </form>
    )
}

export default TaskForm
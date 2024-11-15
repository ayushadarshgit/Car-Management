"use client"
import axiosInstance from '@/api/axiosInstance';
import { Task } from '@/types/tasks/index.type';
import React, { useEffect, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Todo from './components/Todo';
import InProgress from './components/InProgress';
import Completed from './components/Completed';
import PrimaryLoader from '@/components/loaders/PrimaryLoader';

const Board = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [tasks, setTasks] = useState<Task[]>([]);


    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/tasks/getall");
            setTasks([...response.data.data]);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleDragEnd = async (result: DropResult) => {
        if (result.source.droppableId && result.destination?.droppableId) {
            if (result.destination?.droppableId !== result.source.droppableId) {
                console.log(result.destination?.droppableId, result.source.droppableId);
                try {
                    setLoading(true);
                    await axiosInstance.post("/tasks/updatestatus/" + result.draggableId, {status: result.destination?.droppableId});
                    setTasks((prev) => {
                        let hold = prev.filter((task) => task._id !== result.draggableId);
                        let task = prev.filter((task) => task._id === result.draggableId)[0];
                        hold.push({...task, status: result.destination?.droppableId!});
                        return hold;
                    })
                } catch (err) {
                    console.log(err);
                } finally {
                    setLoading(false);
                }
            }
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="flex-1 w-full self-center flex flex-col p-4">
            {
                loading
                    ?
                    <div className="flex-1 flex justify-center items-center">
                        <PrimaryLoader />
                    </div>
                    :
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className='flex flex-col md:flex-row gap-6 flex-1'>
                            <Todo tasks={tasks} />
                            <InProgress tasks={tasks} />
                            <Completed tasks={tasks} />
                        </div>
                    </DragDropContext>
            }
        </div>
    )
}

export default Board
"use client"
import PrimaryModal from "@/components/modals/PrimaryModal";
import { CirclePlus, ListFilter } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import axiosInstance from "@/api/axiosInstance";
import PrimaryLoader from "@/components/loaders/PrimaryLoader";
import { Task } from "@/types/tasks/index.type";
import TaskCard from "@/components/cards/TaskCard";
import FilterForm from "./components/FilterForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


const Home = () => {
  const [tasks, setTasks] = useState<Task []>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addTaskVisible, setAddTaskVisible] = useState<boolean>(false);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const toast = useToast();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/tasks/getall", {params: searchParams});
      setTasks([...response.data.data]);
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

  const onAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
    setAddTaskVisible(false);
  }

  const onEditTask = (task: Task) => {
    setTasks((prev) => prev.map(hold => {return (hold._id === task._id ? {...task} : {...hold})}));
  }

  const onDelete = async (_id: string) => {
    setLoading(true);
    try {
      await axiosInstance.delete("/tasks/delete/" + _id);
      setTasks((prev) => prev.filter((task) => task._id != _id));
    } catch (err) { 
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [searchParams]);

  return (
    <div className="flex-1 px-10 md:max-w-[1024px] w-full bg-black self-center flex flex-col" style={{maxHeight: "calc(100vh - 4rem)"}}>
      {
        loading
        ?
        <div className="flex-1 flex justify-center items-center">
          <PrimaryLoader />
        </div>
        :
        <Fragment>
          <div className="flex flex-row justify-between py-6"> 
            <PrimaryModal 
              icon={<ListFilter className="w-4 h-4" />} 
              title="Filters" 
              description="Apply Filters for better search" 
              open={filterVisible} 
              setOpen={setFilterVisible} 
              label="Filters"
            >
              <FilterForm 
                priority={searchParams.get("priority")} 
                status={searchParams.get("status")} 
                sort={searchParams.get("sort")}
                onFinish={() => setFilterVisible(false)} 
              />
            </PrimaryModal>

            <PrimaryModal 
              icon={<CirclePlus className="w-5 h-5" />} 
              title="Create Task" 
              description="Fill the details of your new task" 
              open={addTaskVisible} 
              setOpen={setAddTaskVisible} 
              label="Add Task"
            >
              <TaskForm type="create" onFinish={onAddTask} />
            </PrimaryModal>
          </div>
          {
            !tasks || tasks.length === 0
            ?
            <div className="flex-1 flex justify-center items-center text-center">
              <div className="flex flex-col gap-2">
                <p>
                  No Tasks Found
                </p>
                <p>Press on <CirclePlus className="inline-block w-5 h-5" /> icon to add tasks</p>
              </div>
            </div>
            :
            <div className="modified-scrollbar w-full flex flex-col items-center gap-6 flex-1 overflow-y-scroll max-h-min pb-6"> 
              {
                tasks.map((task: Task, index) => {
                  return (
                    <TaskCard {...task} key={index} onDelete={onDelete} onEdit={onEditTask} />
                  )
                })
              }
            </div>
          }
        </Fragment>
      }
    </div>
  );
}

export default Home;
import { Request, Response } from "express";
import tasks from "../../models/tasks";
import user from "../../models/user";
import { AuthRequest } from "../../types/app";

export const create = async (req: AuthRequest, res: Response) => {
    console.log("create task");

    try {
        const newTask = new tasks({...req.body, author: req.id});
        const createdTask = await newTask.save();
        await user.updateOne({_id: req.id}, {$push: {tasks: createdTask}});
        return res.status(200).json({message: "Task Created Successfully!", data: createdTask});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Something Went Wrong!"});
    }
}

export const getAll = async (req: AuthRequest, res: Response) => {
    console.log("get all tasks");

    let searchObject: any = {};

    if (req.query.priority && req.query.priority !== "all") {
        searchObject.priority = req.query.priority;
    }

    if (req.query.status && req.query.status !== "all") {
        searchObject.status = req.query.status;
    }

    try {
        const fetchedTasks = await tasks.find({author: req.id, ...searchObject}).sort({dueDate: (req.query.sort === "asc" ? 1: -1)});
        return res.status(200).json({message: "Tasks Fetched Successfully!", data: fetchedTasks});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Something Went Wrong!"});
    }
}

export const update = async (req: AuthRequest, res: Response) => {
    console.log("update task");
    const {id} = req.params;

    try {
        const findTask = await tasks.findById(id);
        if (!findTask) {
            return res.status(404).json({message: "Task Not Found!"});
        }

        const updatedTask = await tasks.updateOne({_id: id}, {...req.body});
        return res.status(200).json({message: "Task Updated Successfully!", data: updatedTask})
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Something Went Wrong!"});
    }
}

export const updateStatus = async (req: AuthRequest, res: Response) => {
    console.log("update status");
    const {id} = req.params;

    try {
        const findTask = await tasks.findById(id);
        if (!findTask) {
            return res.status(404).json({message: "Task Not Found!"});
        }

        const updatedTask = await tasks.updateOne({_id: id}, {...req.body});
        return res.status(200).json({message: "Task Updated Successfully!", data: updatedTask})
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Something Went Wrong!"});
    }
}

export const remove = async (req: AuthRequest, res: Response) => {
    console.log("delete task");
    const {id} = req.params;

    try {
        await user.updateOne({_id: req.id}, {$pull: {tasks: {$in: [id]}}});
        await tasks.deleteOne({_id: id});
        return res.status(200).json({message: "Task Successfully Deleted!"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Something Went Wrong!"});
    }
}
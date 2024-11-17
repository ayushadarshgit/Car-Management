import { Response } from "express";
import cars from "../../models/cars";
import { AuthRequest } from "../../types/app";
import cloudinary from "../../services/cloudinary";

// To create a car
export const create = async (req: AuthRequest, res: Response) => {
    console.log("create Car");

    const { title, description, images, tags } = req.body;
    try {
        const uploadRequests = images.map((image: string) => cloudinary.uploader.upload(image));

        const responses = await Promise.all(uploadRequests);

        const newCar = await cars.create({
            title,
            description,
            images: responses.map((response) => response.secure_url),
            tags,
            user: req.id,
        });
        res.status(201).json({data: newCar, message: "Car Created Successfully!"});
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message || "Something Went Wrong!" });
    }
};

// get paginated list of cars
export const get = async (req: AuthRequest, res: Response) => {
    console.log("Get Cars");

    const { page = 1, limit = 20, ...query }: any = req.query;

    const mongoQuery: any = {};

    if (query.user) {
        mongoQuery.user = query.user;
    }

    if (query.search) {
        mongoQuery["$text"] = {
            "$search": query.search
        }
    }

    try {
        const numberOfRecords = await cars.find(mongoQuery).countDocuments();
        const fetchedCars = await cars.find(mongoQuery).skip((page - 1) * limit).limit(limit);
        return res.status(200).json({data: fetchedCars, totalPages: Math.ceil(numberOfRecords / limit), currentPage: page, message: "Successfully fetched Cars!"});
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({message: err.message || "Something Went Wrong!"});
    }
}

// to get a particular car by its car id
export const getCarById = async (req: AuthRequest, res: Response) => {
    console.log("get car by Id");
    const { id } = req.params;

    try {
        // Find the car by ID
        const car = await cars.findById(id);

        if (!car) {
            res.status(404).json({ message: "Car not found" });
            return;
        }

        res.status(200).json(car);
    } catch (err: any) {
        console.error("Error fetching car:", err);
        res.status(500).json({ message: err.message || "Something Went Wrong!" });
    }
};

// update car details
export const update = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    console.log("Update Car");
    const { id } = req.params;
    const { title, description, tags, images } = req.body;

    try {
        // Find the car by ID
        const car = await cars.findById(id).select("user");

        // If the car is not found
        if (!car) {
            res.status(404).json({ message: "Car not found" });
            return;
        }

        // Check if the car belongs to the logged-in user
        if (car.user.toString() !== req.id) {
            res
                .status(403)
                .json({ message: "You are not authorized to update this car" });
            return;
        }

        // Update fields if provided
        if (title !== undefined) car.title = title;
        if (description !== undefined) car.description = description;
        if (tags !== undefined) car.tags = tags;
        if (images !== undefined) {
            if (images.length > 10) {
                res
                    .status(400)
                    .json({ message: "A car can only have up to 10 images" });
                return;
            }
            car.images = images;
        }

        // Save updated car to the database
        const updatedCar = await car.save();

        res.status(200).json({
            message: "Car updated successfully",
            car: updatedCar,
        });
    } catch (err: any) {
        console.error("Error updating car:", err);
        res.status(500).json({ message: err.message || "Something Went Wrong!" });
    }
};

// delete a car
export const remove = async (req: AuthRequest, res: Response) => {
    console.log("remove car");
    const { id } = req.params; // Car ID from the URL

    try {
        // Find the car by ID
        const car = await cars.findById(id).select("user");

        if (!car) {
            res.status(404).json({ message: "Car not found" });
            return;
        }

        // Check if the logged-in user is the owner of the car
        if (car.user != req.id) {
            res
                .status(403)
                .json({ message: "You are not authorized to delete this car" });
            return;
        }

        // Delete the car
        await car.deleteOne();

        res.status(200).json({ message: "Car deleted successfully" });
    } catch (err: any) {
        console.error("Error deleting car:", err);
        res.status(500).json({message: err.message || "Something Went Wrong!"});
    }
};

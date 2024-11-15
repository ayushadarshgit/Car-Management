import { Request, Response } from "express";
import cars from "../../models/cars/cars";
import user from "../../models/user";
import { AuthRequest } from "../../types/app";
// To create a car
export const createCar = async (req: AuthRequest, res: Response) => {
    console.log("create Car");
    const { title, description, images, tags } = req.body;
    try {
        const newCar = await cars.create({
          title,
          description,
          images,
          tags,
          user: req.id,
        });
        res.status(201).json(newCar);
    }catch (err) {
        console.log(err);
        return res.status(500).json({message: "Something Went Wrong!"});
    }
}

// To get all his cars (particular users cars)
export const getUserCars = async (req:AuthRequest, res:Response) => {
    try {
      const userCars = await cars.find({ user: req.id });
      res.json(cars);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching cars' });
    }
};

//To get all the cars that match the keyword searched will list all cars whose title, description, tags match the keyword.
export const getCarsByKeyword = async (req:AuthRequest, res:Response) => {
    const { keyword } = req.query;
  
    try {
      if (!keyword) {
        return res.status(400).json({ message: "Keyword is required for search." });
      }
  
      const matchingCars = await cars.find({
        $or: [
          { title: keyword },
          { description: keyword },
          { tags: { $elemMatch: keyword } }, // Matches any tag in the array
        ],
      });
  
      res.status(200).json(matchingCars);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Some error fetching the cars"});
    }
};


//To get all cars by pagination
export const getAllCars = async (req:AuthRequest, res:Response) => {
    const { page = 1, limit = 20 } = req.query; 
  
    try {
      const pageNumber = parseInt(page as string, 10);
      const limitNumber = parseInt(limit as string, 10);
  
      const skip = (pageNumber - 1) * limitNumber;
  
      const matchedCars = await cars.find()
        .skip(skip)
        .limit(limitNumber);
  
      const totalCars = await cars.countDocuments();
  
      res.status(200).json({
        matchedCars,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCars / limitNumber),
        totalCars,
      });
    } catch (error) {
      console.error("Error fetching cars:");
      res.status(500).json({ message: "Error fetching cars." });
    }
};

//to get a particular car by its carid
export const getCarById = async (req: AuthRequest, res: Response)  => {
    const { id } = req.params;
  
    try {
      // Find the car by ID
      const car = await cars.findById(id);
  
      if (!car) {
        res.status(404).json({ message: "Car not found" });
        return;
      }
      res.status(200).json(car);
    } catch (error) {
      console.error("Error fetching car:", error);
      res.status(500).json({ message: "Error fetching car" });
    }
};

// update car details
export const updateCar = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, description, tags, images } = req.body;
  
    try {
      // Find the car by ID
      const car = await cars.findById(id);
  
      // If the car is not found
      if (!car) {
        res.status(404).json({ message: "Car not found" });
        return;
      }
  
      // Check if the car belongs to the logged-in user
      if (car.user.toString() !== req.id) {
        res.status(403).json({ message: "You are not authorized to update this car" });
        return;
      }
  
      // Update fields if provided
      if (title !== undefined) car.title = title;
      if (description !== undefined) car.description = description;
      if (tags !== undefined) car.tags = tags;
      if (images !== undefined) {
        if (images.length > 10) {
          res.status(400).json({ message: "A car can only have up to 10 images" });
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
    } catch (error) {
      console.error("Error updating car:", error);
      res.status(500).json({ message: "Error updating car" });
    }
  };

// delete a car
export const deleteCar = async (req: AuthRequest, res: Response)=> {
    const { id } = req.params; // Car ID from the URL
  
    try {
      // Find the car by ID
      const car = await cars.findById(id);
  
      if (!car) {
        res.status(404).json({ message: "Car not found" });
        return;
      }
  
      // Check if the logged-in user is the owner of the car
      if (car.user != req.id) {
        res.status(403).json({ message: "You are not authorized to delete this car" });
        return;
      }
  
      // Delete the car
      await car.deleteOne();
  
      res.status(200).json({ message: "Car deleted successfully" });
    } catch (error) {
      console.error("Error deleting car:", error);
      res.status(500).json({ message: "Error deleting car" });
    }
  };
  
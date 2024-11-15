import express, { Router } from 'express';
import { controllers } from '../../controllers';
import { verifyJWT } from '../../middleware/auth';

const router: Router = express.Router();

router.use(verifyJWT);
router.post("/createCar", controllers.cars.createCar);
router.get("/getUserCars", controllers.cars.getUserCars);
router.get("/getCarsByKeyword", controllers.cars.getCarsByKeyword);
router.get("/getAllCars", controllers.cars.getAllCars);
router.post("/updateCar/:id", controllers.cars.updateCar);
router.delete("/deleteCar/:id", controllers.cars.deleteCar);


export default router;
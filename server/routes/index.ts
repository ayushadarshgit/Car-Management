import express, { Router } from "express";
import authRouter from "./auth";
import carsRouter from "./cars";

const router: Router = express.Router();

router.use("/auth", authRouter);
router.use("/cars", carsRouter);

export default router;
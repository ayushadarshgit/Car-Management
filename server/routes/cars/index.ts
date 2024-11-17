import express, { Router } from 'express';
import { controllers } from '../../controllers';
import { verifyJWT } from '../../middleware/auth';

const router: Router = express.Router();

router.use(verifyJWT);
router.get("/", controllers.cars.get);
router.post("/create", controllers.cars.create);
router.put("/:id", controllers.cars.update);
router.delete("/:id", controllers.cars.remove);

export default router;
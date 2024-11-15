import express, { Router } from 'express';
import { controllers } from '../../controllers';
import { verifyJWT } from '../../middleware/auth';

const router: Router = express.Router();

router.use(verifyJWT);
router.post("/create", controllers.tasks.create);
router.get("/getAll", controllers.tasks.getAll);
router.post("/update/:id", controllers.tasks.update);
router.delete("/delete/:id", controllers.tasks.remove);
router.post("/updateStatus/:id", controllers.tasks.updateStatus);

export default router;
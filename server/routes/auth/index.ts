import express, { Router } from 'express';
import { controllers } from '../../controllers';
import { verifyJWT } from '../../middleware/auth';

const router: Router = express.Router();

router.post("/signup", controllers.auth.signup);
router.post("/login", controllers.auth.login);
router.use(verifyJWT);
router.get("/boot", controllers.auth.boot);
router.get("/logout", controllers.auth.logout);

export default router;
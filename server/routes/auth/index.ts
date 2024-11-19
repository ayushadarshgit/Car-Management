import express, { Router } from 'express';
import { controllers } from '../../controllers';
import { verifyJWT } from '../../middleware/auth';

const router: Router = express.Router();


/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user by providing their name, email, and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user
 *                 example: securepassword123
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: User Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the user
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       description: The email of the user
 *                       example: johndoe@example.com
 *       '403':
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: User Already Exists!
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Something Went Wrong!
 */
router.post("/signup", controllers.auth.signup);

/**  
 * @swagger  
 * /auth/login:  
 *   post:  
 *     summary: User Login  
 *     description: Authenticate user credentials and generate JWT token  
 *     tags:  
 *       - Authentication  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               email:  
 *                 type: string  
 *                 format: email  
 *                 description: User's email address  
 *               password:  
 *                 type: string  
 *                 description: User's password  
 *     responses:  
 *       '200':  
 *         description: Login successful  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                 data:  
 *                   type: object  
 *                   properties:  
 *                     name:  
 *                       type: string  
 *                     email:  
 *                       type: string  
 *       '404':  
 *         description: Invalid credentials  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *       '500':  
 *         description: Internal server error  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 */

router.post("/login", controllers.auth.login);
router.use(verifyJWT);
router.get("/boot", controllers.auth.boot);


router.get("/logout", controllers.auth.logout);

export default router;
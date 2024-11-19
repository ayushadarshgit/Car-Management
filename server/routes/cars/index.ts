import express, { Router } from 'express';
import { controllers } from '../../controllers';
import { verifyJWT } from '../../middleware/auth';

const router: Router = express.Router();

router.use(verifyJWT);

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Fetch Cars
 *     description: Retrieve a paginated list of cars based on query parameters such as user ID and search text.
 *     tags:
 *       - Cars
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number for pagination
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of records per page
 *           example: 20
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *           description: User ID to filter cars by user
 *           example: 63f16dfed1234567890abcde
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           description: Search term to filter cars by text
 *           example: sedan
 *     responses:
 *       '200':
 *         description: Cars retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the car
 *                         example: 61c74c94c8c38f001f0c412a
 *                       title:
 *                         type: string
 *                         description: Title of the car listing
 *                         example: Tesla Model S
 *                       description:
 *                         type: string
 *                         description: Detailed description of the car
 *                         example: A fully electric sedan with autopilot features.
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: URLs of car images
 *                         example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Tags for categorizing the car
 *                         example: ["electric", "sedan"]
 *                       user:
 *                         type: string
 *                         description: User ID who created the car listing
 *                         example: 63f16dfed1234567890abcde
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the car was created
 *                         example: 2024-11-19T10:00:00Z
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number
 *                   example: 1
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Successfully fetched Cars!
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
router.get("/", controllers.cars.get);


router.get("/:id", controllers.cars.getCarById)


/**
 * @swagger
 * /cars/create:
 *   post:
 *     summary: Create a Car
 *     description: Create a new car listing with details including title, description, images, and tags.
 *     tags:
 *       - Cars
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the car listing
 *                 example: Tesla Model S
 *               description:
 *                 type: string
 *                 description: Detailed description of the car
 *                 example: A fully electric sedan with autopilot features.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of base64-encoded image strings to be uploaded
 *                 example: ["data:image/png;base64,iVBORw0KGgoAAAANS..."]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags for categorizing the car
 *                 example: ["electric", "sedan"]
 *     responses:
 *       '201':
 *         description: Car created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the car
 *                       example: 61c74c94c8c38f001f0c412a
 *                     title:
 *                       type: string
 *                       description: Title of the car listing
 *                       example: Tesla Model S
 *                     description:
 *                       type: string
 *                       description: Detailed description of the car
 *                       example: A fully electric sedan with autopilot features.
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: URL of the car image
 *                         example: https://example.com/image1.jpg
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Tags for categorizing the car
 *                       example: ["electric", "sedan"]
 *                     user:
 *                       type: string
 *                       description: User ID who created the car listing
 *                       example: 61c74c94c8c38f001f0c412b
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the car was created
 *                       example: 2024-11-19T10:00:00Z
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Car Created Successfully!
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


router.post("/create", controllers.cars.create);



/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Update Car
 *     description: Update the details of a car by its ID. Only the owner of the car can update it.
 *     tags:
 *       - Cars
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the car to be updated
 *         example: 61c74c94c8c38f001f0c412a
 *       - in: body
 *         name: car
 *         required: true
 *         description: Fields to update in the car
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Title of the car
 *               example: Updated Tesla Model S
 *             description:
 *               type: string
 *               description: Updated description of the car
 *               example: Updated description for the electric sedan.
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               description: Tags to categorize the car
 *               example: ["updated", "electric"]
 *             images:
 *               type: array
 *               items:
 *                 type: string
 *               description: Array of URLs for car images (maximum of 10)
 *               example: ["https://example.com/newimage1.jpg", "https://example.com/newimage2.jpg"]
 *     responses:
 *       '200':
 *         description: Car updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Car updated successfully
 *                 car:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier of the car
 *                       example: 61c74c94c8c38f001f0c412a
 *                     title:
 *                       type: string
 *                       description: Updated title of the car
 *                       example: Updated Tesla Model S
 *                     description:
 *                       type: string
 *                       description: Updated description of the car
 *                       example: Updated description for the electric sedan.
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Updated tags for the car
 *                       example: ["updated", "electric"]
 *                     images:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Updated URLs of car images
 *                       example: ["https://example.com/newimage1.jpg", "https://example.com/newimage2.jpg"]
 *                     user:
 *                       type: string
 *                       description: User ID of the car owner
 *                       example: 63f16dfed1234567890abcde
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the car was created
 *                       example: 2024-11-19T10:00:00Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the car was last updated
 *                       example: 2024-11-19T12:00:00Z
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: A car can only have up to 10 images
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Authorization error message
 *                   example: You are not authorized to update this car
 *       '404':
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Car not found
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


router.put("/:id", controllers.cars.update);

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Delete Car
 *     description: Deletes a car by its ID. Only the owner of the car can delete it.
 *     tags:
 *       - Cars
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the car to be deleted
 *         example: 61c74c94c8c38f001f0c412a
 *     responses:
 *       '200':
 *         description: Car deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Car deleted successfully
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Authorization error message
 *                   example: You are not authorized to delete this car
 *       '404':
 *         description: Car not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Car not found
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
router.delete("/:id", controllers.cars.remove);

export default router;
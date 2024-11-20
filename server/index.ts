import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import swaggerjsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import router from "./routes";

const app: Express = express();

// app.use(cors());

const corsOptions = {
  origin: 'https://car-management-bice.vercel.app', // Your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply the CORS middleware to all routes
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Car management API Documentation',
            version: '1.0.0',
            description: 'API documentation.',
        },
        servers: [
            {
                url: `http://localhost:8000`,
                description: 'Deployed server',
            },
        ]
    },
    apis: ['./routes/*/*.ts'],

};

const specs = swaggerjsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", router);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@kanban-cluster-0.5q9wq.mongodb.net/?retryWrites=true&w=majority&appName=kanban-cluster-0`).then(() => {
    console.log("database connected");
    app.listen(8000, () => {
        console.log("App running on 8000 port");
    })
}).catch((err: any) => {
    console.log(err);
})

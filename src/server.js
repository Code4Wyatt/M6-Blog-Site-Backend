import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";
import authorsRouter from "./services/authors/index.js";
import blogsRouter from "./services/blogs/index.js";
import { badRequestHandler, notFoundHandler, genericErrorHandler } from './errorHandlers.js';

const server = express();

const port = process.env.PORT;

const whitelist = [process.env.FE_LOCAL_URL, process.env.REACT_APP_FE_PROD_URL];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error({ status: 500, message: "CORS ERROR" }));
        }
    },
};

// Middlewares 

server.use(cors(corsOptions));
server.use(express.json());

// Routes

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogsRouter);

// Error Handler Middlewares

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected!");

    server.listen(port, () => {
        console.table(listEndpoints(server));
        console.log(`Server running on port: ${port}`);
    })
})


// No longer needed as we have middlewares for this now 

// mongoose.connection.on("error", err => {
//     console.log(err);
// })

export default server;
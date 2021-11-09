import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";

const server = express();

const port = process.env.PORT;

// Middlewares 

server.use(cors());
server.use(express.json());

// Routes

// Error Handlers

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected!");

    server.listen(port, () => {
        console.table(listEndpoints(server));

        console.log("Server running on port: ${port} ");
    })
})

mongoose.connection.on("error", err => {
    console.log(err);
})
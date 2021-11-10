import express from "express";
import sendRegistrationEmail from "./requestHandler";

const registerRouter = express.Router();

// Registration router for implementaion later

registerRouter.post("/register", async (req, res, next) => {
    try {
        const { email, firstName, lastName } = req.body;
        await sendRegistrationEmail(email, firstName, lastName);
        res.send({ message: "Registration successful!" })
    } catch (error) {
        next(error);
    }
});


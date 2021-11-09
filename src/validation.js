import { body } from "express-validator";

export const authorValidation = [
    body("firstName").exists().isString().withMessage("First name is required"),
    body("lastName").exists().isString().withMessage("Surname is required"),
    body("email").exists().isEmail().withMessage("Email is required"),
    body("dateOfBirth").exists().isEmail().withMessage("Date of birth is required"),
    body("avatar").exists().isURL().withMessage("Please include an avatar")
];
import { body } from "express-validator";

export const authorValidation = [
    body("name").exists().isString().withMessage("First name is required"),
    body("surname").exists().isString().withMessage("Surname is required"),
    body("email").exists().isEmail().withMessage("Email is required"),
    body("dateOfBirth").exists().isString().withMessage("Date of birth is required"),
    body("avatar").exists().isURL().withMessage("Please include an avatar")
];

export const blogValidation = [
    body("category").exists().isString().withMessage("Category is required"),
    body("title").exists().isString().withMessage("Title is required"),
    body("cover").exists().isURL().withMessage("Cover is required"),
    body("email").optional().isEmail().withMessage("Email is required"),
    body("readTime").exists().withMessage("Read time is required"),
    body("readTime.value").exists().withMessage("Read time value is required"),
    body("readTime.unit").exists().isString().withMessage("Read time unit is required"),
    body("author").exists().isObject().withMessage("Author is required"),
    body("author.name").exists().isString().withMessage("Author name is required"),
    body("author.avatar").exists().isURL().withMessage("Author avatar is required"),
    body("content").exists().isString().withMessage("Content is required to post"),
    
];

export const commentValidation = [
    body("name").exists().isString().withMessage("Name is required"),
    body("comment").exists().isString().withMessage("Please insert a comment"),
];
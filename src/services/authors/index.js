import express from "express";
import { authorValidation } from "../../validation.js";
import multer from 'multer'; // for uploading files
import { getAuthorsCSV, getAuthors, getAuthorById, updateAuthorAvatar, newAuthor, editAuthor, deleteAuthor, getAuthorBlogPosts } from "../../database/controllers/authorsController.js";
import { uploadAvatarImageToCloud } from '../../lib/image-tools.js';

const authorsRouter = express.Router();

// Get all authors and post new Author routes

authorsRouter.route("/").get(getAuthors).post(authorValidation, newAuthor);

// Get authors CSV

authorsRouter.route("/authorsCSV").get(getAuthorsCSV);

// Get, Put and Delete a specific author routes

authorsRouter.route("/:id").get(getAuthorById).put(editAuthor).delete(deleteAuthor);

// Get blog posts from a specific author routes

authorsRouter.get("/:id/blogPosts", getAuthorBlogPosts);

// Upload author avar image

authorsRouter.post("/:id/uploadAvatar", uploadAvatarImageToCloud, updateAuthorAvatar);


export default authorsRouter;

import express from "express";
import { blogPostValidation, commentValidation } from "../../validation.js";
import { getAllPosts, getPostById, getComments, getComment, updateComment, addComment, deleteComment, updateBlogPost, updateBlogCover, deleteBlogPost, postBlogPost, downloadPDF } from "../../db/controllers/blogPosts.controller.js";
import { uploadBlogImageToCloud } from "../../lib/image-tools.js";

const blogPostRouter = express.Router();

// Get Blog Posts

blogPostRouter.route("/").get(getAllPosts).post(blogPostValidation, postBlogPost);

// Get, Put and Delete Specific Blog

blogPostRouter.route("/:id").get(getPostById).put(updateBlogPost).delete(deleteBlogPost);

// Get and Post comments

blogPostRouter.route("/:id/comments").get(getComments).put(updateComment).delete(deleteComment);

blogPostRouter.route("/:id/comments/:commentId").get(getComment).put(updateComment).delete(deleteComment); // getting comment, updating then deleting

// Post Blog Cover

blogPostRouter.route("/:id/uploadCover").post(uploadBlogImageToCloud, updateBlogCover); // posting the image to the cloud initially, then grabbing and updating it in the database with updateBlogCover controller

export default blogPostsRouter;
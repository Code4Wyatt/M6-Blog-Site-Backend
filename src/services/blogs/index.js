import express from "express"
import fs from "fs";
import createHttpError from "http-errors"
import AuthorModel from "./schema.js"

const blogsRouter = express.Router()

blogsRouter.post("/", async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel(req.body)
        const { _id } = await newAuthor.save()
        res.status(201).send({_id})
    } catch (error){
      next(error)
    }
})

blogsRouter.get("/", async (req, res, next) => {
    try {
        const authors = await AuthorModel.find()
        res.send(authors)
    } catch (error){
      next(error)
    }
})

blogsRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id

        const author = await AuthorsModel.findById(id)
        if (author) {
            res.send(author)
        } else {
            next(createHttpError(404, `User with ${id} not found`))
        }
    } catch (error){
      next(error)
    }
})

blogsRouter.put("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const updatedAuthor = await AuthorsModel.findByIdAndUpdate(id, req.body, { new: true })

        if (updatedAuthor) {
            res.send(updatedAuthor)
        } else (
            next(createHttpError(404, `User with ${id} not found`))
        )
    } catch (error){
      next(error)
    }
})

blogsRouter.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const deletedAuthor = await AuthorsModel.findByIdAndDelete(id)
        if (deletedAuthor) {
            res.status(404).send()
        } else {
            next(createHttpError(404, `User with id ${id} not found`))
        }
    } catch (error){
      next(error)
    }
})

export default blogsRouter;

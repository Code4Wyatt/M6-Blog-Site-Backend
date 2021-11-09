import express from "express"

import authorsSchema from "./schema.js"

const authorsRouter = express.Router()

authorsRouter.post("/", async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel(req.body)
    } catch (error){
      next(error)
    }
})

authorsRouter.get("/", async (req, res, next) => {
    try {
        
    } catch (error){
      next(error)
    }
})

authorsRouter.get("/:id", async (req, res, next) => {
    try {
        
    } catch (error){
      next(error)
    }
})

authorsRouter.put("/:id", async (req, res, next) => {
    try {
        
    } catch (error){
      next(error)
    }
})

authorsRouter.delete("/:id", async (req, res, next) => {
    try {
        
    } catch (error){
      next(error)
    }
})

export default authorsRouter;

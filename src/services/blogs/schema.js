import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    author: {
        name: { type: String, required: true },
        avatar: { type: String, required: true }
    },
    readTime: {
        type: Object,
        required: true,
        nested: {
            value: {
                type: Number,
                required: true,
            },
            unit: {
                type: String,
                required: true,
            },
        },
    }
}, {
    timestamps: true, // Create and manage createdAt and updatedAt automatically
})

export default model("Author", authorSchema) // links to the Authors collection in the database
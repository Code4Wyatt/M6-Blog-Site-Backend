import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    avatar: { type: String, required: true}
}, {
    timestamps: true, // Create and manage createdAt and updatedAt automatically
})

export default model("Author", authorSchema) // links to the Authors collection in the database
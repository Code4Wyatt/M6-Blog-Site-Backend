import mongoose, { Schema } from "mongoose";

const { schema } = mongoose;

const authorsSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    avatar: { type: String, required: true}
}, {
    timestamps: true // Create and manage createdAt and updatedAt automatically
})

export default model("Author", authorsSchema) // links to the Authors collection in the database
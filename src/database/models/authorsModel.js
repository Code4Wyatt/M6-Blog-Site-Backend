import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    avatar: {
        type: String,
    }
},
    { timestamps: true }
);

const authorModel = mongoose.model("author", authorSchema);
export default authorModel;

import mongoose from "mongoose";

const widgitSchema = new mongoose.Schema({
    position: {
        type: String
    },
    imageUrl: {
        type: String
    }
})

const WidgitModel = mongoose.model("Widgit Setting", widgitSchema)

export default WidgitModel
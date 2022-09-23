import mongoose from 'mongoose';

const DB_URL = 'mongodb+srv://widgit:widgit@cluster0.zae5eby.mongodb.net/?retryWrites=true&w=majority'

const connectDatabase = () => {
    new mongoose.connect(DB_URL, {useUnifiedTopology: true}).then((data) => {
        console.log("Database connected to: ", data.connection.host)
    }).catch((error) => console.log(error))
}

export default connectDatabase;

import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    try {
        // const options: ConnectOptions = {
        //     useUnifiedTopology: true,
        //     useCreateIndex: true,
        // };

        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

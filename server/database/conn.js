import mongoose from 'mongoose';
import ENV from '../config.js';

async function connect() {
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(ENV.ATLAS_URI);
    console.log('DB connected successfully');

    return db;
}

export default connect;
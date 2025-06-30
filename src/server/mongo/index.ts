import mongoose from 'mongoose';

import { MONGO_URI } from "$env/static/private";

if (!MONGO_URI) {
    throw new Error("You must provide a mongodb connection string through the MONGO_URI environment variable!");
}

export default async function () {
    return await mongoose.connect(MONGO_URI);
}

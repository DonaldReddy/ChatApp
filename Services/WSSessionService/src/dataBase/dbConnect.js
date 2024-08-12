import mongoose from "mongoose";

export default async function dbConnect() {
	try {
		console.log("connecting to WebSocket Session DB....");
		await mongoose.connect(process.env.DB_URI);
		console.log("connected to WebSocket Session DB!");
	} catch (error) {
		console.log(error);
	}
}

import mongoose from "mongoose";

export default async function dbConnect() {
	try {
		console.log("connecting to chat DB");
		await mongoose.connect(process.env.DB_URI);
		console.log("connected to chat DB");
	} catch (error) {
		console.log(error);
	}
}

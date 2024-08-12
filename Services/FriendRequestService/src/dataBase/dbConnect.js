import mongoose from "mongoose";

export default async function dbConnect() {
	try {
		console.log("connecting to friend request DB");
		await mongoose.connect(process.env.DB_URI);
		console.log("connected to friend request DB");
	} catch (error) {
		console.log(error);
	}
}

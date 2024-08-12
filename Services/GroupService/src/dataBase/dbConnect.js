import mongoose from "mongoose";

export default async function dbConnect() {
	try {
		console.log("connecting to group DB");
		await mongoose.connect(process.env.DB_URI);
		console.log("connected to group DB");
	} catch (error) {
		console.log(error);
	}
}

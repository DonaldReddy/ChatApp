import mongoose from "mongoose";

export default async function dbConnect() {
	try {
		console.log("connecting to message DB");
		await mongoose.connect(process.env.DB_URI);
		console.log("connected to message DB");
	} catch (error) {
		console.log(error);
	}
}

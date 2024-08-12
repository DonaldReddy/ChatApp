import mongoose from "mongoose";

export default async function dbConnect() {
	try {
		console.log("connecting to Group Invite DB");
		await mongoose.connect(process.env.DB_URI);
		console.log("connected to Group Invite DB");
	} catch (error) {
		console.log(error);
	}
}

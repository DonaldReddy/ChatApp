import mongoose from "mongoose";

const WStSessionSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			unique: true,
			required: true,
		},
		wsID: {
			type: String,
			unique: true,
			required: true,
		},
	},
	{ timestamps: true },
);

const WSSession = mongoose.model("WSSession", WStSessionSchema);

export default WSSession;

import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			required: true,
			unique: true,
		},
		refreshToken: {
			type: String,
			required: true,
			unique: true,
		},
		accessToken: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timestamps: true },
);

const Session = mongoose.model("Session", SessionSchema);

export default Session;

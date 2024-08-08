import mongoose from "mongoose";

const SocketSessionSchema = new mongoose.Schema(
	{
		user: {
			type: String,
			unique: true,
			required: true,
		},
		socketId: {
			type: String,
			unique: true,
			required: true,
		},
	},
	{ timestamps: true }
);

const SocketSession = mongoose.model("SocketSession", SocketSessionSchema);

export default SocketSession;

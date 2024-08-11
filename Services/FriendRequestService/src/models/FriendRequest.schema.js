import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
	{
		from: {
			type: String,
			required: true,
			index: true, // Add index for performance
		},
		to: {
			type: String,
			required: true,
			index: true, // Add index for performance
		},
		status: {
			type: String,
			enum: ["accepted", "pending", "rejected", "canceled"],
			default: "pending",
		},
	},
	{ timestamps: true },
);

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

export default FriendRequest;

import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
	{
		from: {
			type: String,
			required: true,
		},
		to: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["accepted", "rejected"],
			required: true,
		},
	},
	{ timestamps: true }
);

// Add an index on `from` and `to` for better query performance
FriendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

const FriendRequest = mongoose.model("FriendRequest", FriendRequestSchema);

export default FriendRequest;

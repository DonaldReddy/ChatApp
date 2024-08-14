import mongoose from "mongoose";

const GroupInviteSchema = new mongoose.Schema(
	{
		from: {
			type: String,
			required: true,
		},
		to: {
			type: String,
			required: true,
		},
		groupName: {
			type: String,
			required: true,
		},
		groupId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["accepted", "pending", "rejected"],
			required: true,
			default: "pending",
		},
	},
	{ timestamps: true },
);

const GroupInvite = mongoose.model("GroupInvite", GroupInviteSchema);

export default GroupInvite;

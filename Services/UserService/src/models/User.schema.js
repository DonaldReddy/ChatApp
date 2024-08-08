import mongoose from "mongoose";
import moment from "moment-timezone";

const UserSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastSeen: {
			type: Date,
			default: () => moment().tz("Asia/Kolkata").toDate(),
		},
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		blockedUsers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		blockedGroups: { type: [String], default: [] },
	},
	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;

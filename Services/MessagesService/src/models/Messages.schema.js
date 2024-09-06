import mongoose from "mongoose";
import moment from "moment-timezone";

const MessageSchema = new mongoose.Schema(
	{
		chatId: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		sentAt: {
			type: Date,
			required: true,
			default: () => moment().tz("Asia/Kolkata").toDate(),
		},
		deliveredAt: {
			type: Date,
		},
		seenBy: [
			{
				userName: {
					type: String,
					required: true,
				},
				seenAt: {
					type: Date,
					default: () => moment().tz("Asia/Kolkata").toDate(),
				},
			},
		],
		deletedFor: [
			{
				userName: {
					type: String,
					required: true,
				},
				deletedAt: {
					type: Date,
					default: () => moment().tz("Asia/Kolkata").toDate(),
				},
			},
		],
		messageBody: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;

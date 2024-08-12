import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
	{
		createdBy: {
			type: String,
			required: true,
		},
		chatType: {
			type: String,
			enum: ["private", "group"],
			required: true,
			default: "private",
		},
		participants: {
			type: [String],
			required: true,
			default: [],
		},
		noOfParticipants: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

// Pre-save middleware to count and update noOfParticipants
ChatSchema.pre("save", function (next) {
	// Add createdBy to participants if the chat is new
	if (this.isNew) {
		this.participants.push(this.createdBy);
	}

	// Update noOfParticipants to the exact number of participants
	this.noOfParticipants = this.participants.length;

	next();
});

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;

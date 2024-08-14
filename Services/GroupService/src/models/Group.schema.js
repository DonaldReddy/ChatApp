import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
	{
		groupChatId: {
			type: String,
			required: true,
			unique: true,
		},
		groupOwner: {
			type: String,
			required: true,
		},
		groupAdmins: {
			type: [String],
			default: [], // Default to an empty array
		},
		groupName: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true },
);

// Pre-save middleware to ensure owner is in admins array
GroupSchema.pre("save", function (next) {
	if (this.isNew) {
		// Only add owner if this is a new document
		this.groupAdmins.push(this.groupOwner);
	}
	next();
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;

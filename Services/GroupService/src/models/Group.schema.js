import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
	{
		chatId: {
			type: String,
			required: true,
			unique: true,
		},
		owner: {
			type: String,
			required: true,
		},
		admins: {
			type: [String],
			required: true,
			default: [], // Default to an empty array
		},
		name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

// Pre-save middleware to ensure owner is in admins array
GroupSchema.pre("save", function (next) {
	if (this.isNew) {
		// Only add owner if this is a new document
		this.admins.push(this.owner);
	}
	next();
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;

import mongoose from "mongoose";
import Group from "../models/Group.schema.js";

const { ObjectId } = mongoose.Types;

// Creates a new group and saves it to the database
async function createNewGroup(req, res) {
	try {
		const { userName, groupName, chatId } = req.body;
		const newGroup = new Group({
			groupOwner: userName,
			groupChatId: chatId,
			groupName: groupName,
		});
		await newGroup.save();
		res.status(200).send({ status: true, group: newGroup });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Deletes a group from the database by its ID
async function deleteGroup(req, res) {
	try {
		const { groupId } = req.body;
		await Group.findByIdAndDelete(new ObjectId(groupId));
		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Promotes a user to admin within a group
async function promoteToAdmin(req, res) {
	try {
		const { groupId, userName } = req.body;
		const existingGroup = await Group.findById(new ObjectId(groupId));
		if (!existingGroup) throw new Error("Invalid Group Id");
		if (existingGroup.groupAdmins.includes(userName))
			throw new Error("User is already admin");
		existingGroup.groupAdmins.push(userName);
		await existingGroup.save();
		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Demotes a user to member within a group
async function demoteToMember(req, res) {
	try {
		const { groupId, userName } = req.body;
		const existingGroup = await Group.findById(new ObjectId(groupId));
		if (!existingGroup) throw new Error("Invalid Group Id");
		if (!existingGroup.groupAdmins.includes(userName))
			throw new Error("User is not an admin");
		existingGroup.groupAdmins.pull(userName);
		await existingGroup.save();
		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Get group information
async function getGroup(req, res) {
	try {
		const { groupId } = req.query;
		const existingGroup = await Group.findOne({
			groupChatId: new ObjectId(groupId),
		});
		if (!existingGroup) throw new Error("Invalid Group Id");
		res.status(200).send({ status: true, group: existingGroup });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

export {
	createNewGroup,
	deleteGroup,
	promoteToAdmin,
	demoteToMember,
	getGroup,
};

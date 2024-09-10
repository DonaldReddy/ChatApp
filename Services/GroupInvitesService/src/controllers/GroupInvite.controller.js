import GroupInvite from "../models/GroupInvite.schema.js";
import axios from "axios";
import services from "../../services.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

// Function to send group invites to specified users
async function sendGroupInvites(req, res) {
	try {
		const { senderUserName, groupId, receiverUserNames } = req.body;

		const groupResponse = await axios.get(
			`${services.group.target}/api/v1/group/get-group?groupId=${groupId}`,
		);

		if (!groupResponse.data.status) throw new Error(groupResponse.data.error);

		const group = groupResponse.data.group;

		if (!group.groupAdmins.includes(senderUserName))
			throw new Error("Sender is not Admin");

		const chatResponse = await axios.get(
			`${services.chat.target}/api/v1/chat/get-chat?chatId=${group.groupChatId}`,
		);
		if (!chatResponse.data.status) throw new Error(chatResponse.data.error);

		const chat = chatResponse.data.chat;

		const result = receiverUserNames.map(async (userName) => {
			if (!chat.participants.includes(userName)) {
				const newInvite = new GroupInvite({
					from: senderUserName,
					to: userName,
					groupName: group.groupName,
					groupId: group._id,
				});
				await newInvite.save();
			}
		});

		await Promise.all(result);

		res.send({ status: true });
	} catch (error) {
		res.send({ status: true, error: error.message });
	}
}

// Function to get received group invites for a specific user
async function getReceivedGroupInvites(req, res) {
	try {
		const { userName } = req.query;
		const invites = await GroupInvite.find({ to: userName, status: "pending" });

		res.send({ status: true, invites });
	} catch (error) {
		res.send({ status: true, error: "Failed to fetch Invites" });
	}
}

// Function to get sent group invites by a specific user
async function getSentGroupInvites(req, res) {
	try {
		const { userName } = req.query;
		const invites = await GroupInvite.find({ from: userName });

		res.send({ status: true, invites });
	} catch (error) {
		res.send({ status: true, error: "Failed to fetch Invites" });
	}
}

// Function to accept a group invite
async function acceptGroupInvite(req, res) {
	try {
		const { groupInviteId } = req.body;
		const invite = await GroupInvite.findById(new ObjectId(groupInviteId));

		if (!invite) throw new Error("Invalid invite");

		const groupResponse = await axios.get(
			`${services.group.target}/api/v1/group/get-group?groupId=${invite.groupId}`,
		);

		if (!groupResponse.data.status) throw new Error(groupResponse.data.error);

		const chatResponse = await axios.post(
			`${services.chat.target}/api/v1/chat/add-member-to-chat`,
			{
				chatId: groupResponse.data.group.groupChatId,
				userName: invite.to,
			},
		);

		if (!chatResponse.data.status) throw new Error(chatResponse.data.error);

		await GroupInvite.deleteMany({ to: invite.to, groupId: invite.groupId });

		res.send({ status: true });
	} catch (error) {
		res.send({ status: true, error: error.message });
	}
}

// Function to reject a group invite
async function rejectGroupInvite(req, res) {
	try {
		const { groupInviteId } = req.body;
		const invite = await GroupInvite.findById(new ObjectId(groupInviteId));
		if (!invite) throw new Error("Invalid id");
		invite.status = "rejected";
		await invite.save();
		res.send({ status: true });
	} catch (error) {
		res.send({ status: true, error: error.message });
	}
}

// Function to delete a group invite
async function deleteGroupInvite(req, res) {
	try {
		const { groupInviteId } = req.body;
		const invite = await GroupInvite.findById(new ObjectId(groupInviteId));
		if (!invite) throw new Error("Invalid id");
		await invite.deleteOne();
		res.send({ status: true });
	} catch (error) {
		res.send({ status: true, error: error.message });
	}
}

export {
	sendGroupInvites,
	getReceivedGroupInvites,
	getSentGroupInvites,
	acceptGroupInvite,
	rejectGroupInvite,
	deleteGroupInvite,
};

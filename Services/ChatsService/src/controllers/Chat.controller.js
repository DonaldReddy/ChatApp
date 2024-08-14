import Chat from "../models/Chats.schema.js";
import axios from "axios";
import services from "../../services.js";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

// Creates a new group chat and stores it in the database
async function createNewGroupChat(req, res) {
	try {
		const { userName, groupName } = req.body;

		if (!userName || !groupName) throw new Error("Invalid Inputs");

		const newChat = new Chat({ createdBy: userName, chatType: "group" });
		const response = await axios.post(
			`${services.group.target}/api/v1/group/create-new-group`,
			{
				userName,
				groupName,
				chatId: newChat._id,
			},
		);
		if (!response.data.status) throw new Error(response.data.error);
		await newChat.save();
		res
			.status(200)
			.send({ status: true, chat: newChat, group: response.data.group });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Creates a new private chat or finds an existing one, then saves it
async function createNewChatAndSendMessage(req, res) {
	try {
		const { userName, friendUserName, message } = req.body;

		if (!userName || !friendUserName || !message)
			throw new Error("Invalid Inputs");

		let existingChat = await Chat.findOne({
			createdBy: userName,
			chatType: "private",
			participants: [friendUserName],
		});
		if (!existingChat) {
			existingChat = new Chat({
				createdBy: userName,
				chatType: "private",
				participants: [friendUserName],
			});
		}

		await existingChat.save();
		res.status(200).send({ status: true, chat: existingChat });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Retrieves the recent chats for a user, with pagination support
async function getRecentChats(req, res) {
	try {
		const { userName } = req.query;
		let { limit = 10, page = 1 } = req.query;

		limit = parseInt(limit);
		page = parseInt(page);

		const chats = await Chat.find({
			participants: { $in: [userName] },
		})
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ updatedAt: -1 });

		res.status(200).send({ status: true, limit, page, chats });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Get chat
async function getChat(req, res) {
	try {
		const { chatId } = req.query;
		console.log(chatId);

		const chat = await Chat.findById(new ObjectId(chatId));
		res.status(200).send({ status: true, chat });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// add member to chat
async function addMemberToChat(req, res) {
	try {
		const { chatId, userName } = req.body;

		const chat = await Chat.findById(new ObjectId(chatId));

		if (!chat.participants.includes(userName)) {
			chat.participants.push(userName);
			await chat.save();
		}

		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// remove member to chat
async function removeMemberFromChat(req, res) {
	try {
		const { chatId, userName } = req.body;

		const chat = await Chat.findById(new ObjectId(chatId));

		if (chat.participants.includes(userName)) {
			chat.participants.pull(userName);
			await chat.save();
		}

		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

export {
	createNewGroupChat,
	createNewChatAndSendMessage,
	getRecentChats,
	getChat,
	addMemberToChat,
	removeMemberFromChat,
};

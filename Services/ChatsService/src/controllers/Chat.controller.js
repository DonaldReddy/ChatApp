import Chat from "../models/Chats.schema.js";
import axios from "axios";
import services from "../../services.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

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
		const { userName, friendUserName, messageBody } = req.body;

		if (!userName || !friendUserName || !messageBody) {
			throw new Error("Invalid Inputs");
		}

		let existingChat = await Chat.findOne({
			chatType: "private",
			participants: { $all: [userName, friendUserName] },
		});

		if (!existingChat) {
			existingChat = new Chat({
				createdBy: userName,
				chatType: "private",
				participants: [userName, friendUserName],
			});
		}

		await existingChat.save();

		const {
			_id: chatId,
			updatedAt: lastMessageAt,
			chatType,
			participants,
		} = existingChat;
		console.log(`${services.message.target}/api/v1/message/send-message`);

		const response = await axios.post(
			`${services.message.target}/api/v1/message/send-message`,
			{
				userName,
				messageBody,
				chatId,
			},
		);

		if (!response.data.status) {
			throw new Error(response.data.error);
		}

		res.status(200).send({
			status: true,
			chat: { chatId, lastMessageAt, chatType, participants },
			message: response.data.message,
		});
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ status: false, error: error.message });
	}
}

// Retrieves the recent private chats for a user, with pagination support
async function getRecentPrivateChats(req, res) {
	try {
		const { userName, search } = req.query;

		let { limit = 10, page = 1 } = req.query;

		limit = parseInt(limit);
		page = parseInt(page);

		const chats = await Chat.find({
			participants: { $in: [userName] },
			chatType: "private",
		})
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ updatedAt: -1 });

		res.status(200).send({ status: true, limit, page, chats });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Retrieves the recent group chats for a user, with pagination support
async function getRecentGroupChats(req, res) {
	try {
		const { userName, search } = req.query;

		let { limit = 10, page = 1 } = req.query;

		limit = parseInt(limit);
		page = parseInt(page);

		const chats = await Chat.find({
			participants: { $in: [userName] },
			chatType: "group",
		})
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ updatedAt: -1 });

		const response = chats.map((chat) =>
			axios.get(
				`${services.group.target}/api/v1/group/get-group?groupId=${chat._id}`,
			),
		);

		const results = await Promise.allSettled(response);

		const failedResponses = results.filter(
			(result) => result.status === "rejected",
		);
		if (failedResponses.length > 0) {
			console.error("Some group details failed to fetch:", failedResponses);
			res
				.status(500)
				.send({ status: false, error: "Failed to fetch some group details" });
			return;
		}

		const chatWithGroup = chats.map((chat, idx) => {
			const groupData =
				results[idx].status === "fulfilled"
					? results[idx].value.data.group
					: null;
			return {
				...chat.toObject(),
				group: groupData,
			};
		});

		res.status(200).send({ status: true, limit, page, chats: chatWithGroup });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Get chat
async function getChat(req, res) {
	try {
		const { chatId } = req.query;
		const chat = await Chat.findById(new ObjectId(chatId));
		res.status(200).send({ status: true, chat });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

// Get chat between two users
async function getChatBetweenTwoUsers(req, res) {
	try {
		const { userName, friendUserName } = req.query;

		const chat = await Chat.findOne({
			participants: { $all: [userName, friendUserName] },
			chatType: "private",
		})
			.select("_id updatedAt chatType participants")
			.lean();

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
	getRecentPrivateChats,
	getRecentGroupChats,
	getChat,
	addMemberToChat,
	removeMemberFromChat,
	getChatBetweenTwoUsers,
};

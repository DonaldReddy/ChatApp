import axios from "axios";
import Message from "../models/Messages.schema.js";
import services from "../../services.js";
import mongoose from "mongoose";
import { createClient } from "redis";

const { ObjectId } = mongoose.Types;

const client = createClient({
	url: process.env.REDIS_URI,
	socket: {
		reconnectStrategy(retries) {
			if (retries > 5) {
				return new Error("Max retries reached");
			}
			return Math.min(retries * 50, 500); // Retry with exponential backoff
		},
	},
});

client.on("connect", () => {
	console.log("Connected to Redis");
});

client.on("end", () => {
	console.log("Disconnected from Redis");
});

client.on("error", (err) => {
	console.error("Redis error:", err.message);
});

client.connect();

async function sendMessage(req, res) {
	try {
		const { author, messageBody, chatId } = req.body;

		if (!author || !messageBody || !chatId) throw new Error("Invalid Params");

		const chatResponse = await axios.get(
			`${services.chat.target}/api/v1/chat/get-chat?chatId=${chatId}`,
		);

		if (!chatResponse.data.status) throw new Error(chatResponse.data.error);

		const chat = chatResponse.data.chat;

		if (!chat.participants.includes(author)) throw new Error("Invalid user");

		const newMessage = new Message({
			chatId: chat._id,
			author,
			messageBody,
		});

		await newMessage.save();

		const message = {
			messageId: newMessage._id,
			author: newMessage.author,
			chatId,
			messageBody,
			sentAt: newMessage.sentAt,
		};

		await client.lPush(
			"messages",
			JSON.stringify({
				participants: chat.participants,
				message,
			}),
		);

		res.status(200).send({
			status: true,
			message,
		});
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

async function getUnDeletedMessage(req, res) {
	try {
		const { chatId, limit = 20, page = 1 } = req.query;

		// Validate the chatId
		if (!chatId) throw new Error("chatId is required");

		// Fetch the chat details from the chat service
		const chatResponse = await axios.get(
			`${services.chat.target}/api/v1/chat/get-chat?chatId=${chatId}`,
		);

		if (!chatResponse.data.status) throw new Error(chatResponse.data.error);

		const chat = chatResponse.data.chat;

		// Retrieve the messages from the database
		let messages = await Message.find({ chatId })
			.sort({ sentAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
			.select("author chatId messageBody sentAt");

		messages = messages.map((message) => {
			return {
				author: message.author,
				chatId: message.chatId,
				messageBody: message.messageBody,
				sentAt: message.sentAt,
				messageId: message._id,
			};
		});

		messages = messages.reverse();

		// Return the messages
		res.status(200).send({ status: true, messages });
	} catch (error) {
		// Catch and handle any errors
		res.status(400).send({ status: false, error: error.message });
	}
}

async function seenMessage(req, res) {
	try {
		const { userName, messageId, seenAt } = req.body;

		const message = await Message.findById(new ObjectId(messageId));

		message.seenBy.push({
			userName,
			seenAt,
		});

		await message.save();

		// Return the messages
		res.status(200).send({ status: true });
	} catch (error) {
		// Catch and handle any errors
		res.status(400).send({ status: false, error: error.message });
	}
}

async function deleteMessage(req, res) {
	try {
		const { userName, messageId, deletedAt } = req.body;

		const message = await Message.findById(new ObjectId(messageId));

		message.deletedFor.push({
			userName,
			deletedAt,
		});

		await message.save();

		// Return the messages
		res.status(200).send({ status: true });
	} catch (error) {
		// Catch and handle any errors
		res.status(400).send({ status: false, error: error.message });
	}
}

export { sendMessage, getUnDeletedMessage, seenMessage, deleteMessage };

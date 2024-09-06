import { Router } from "express";
import {
	createNewChatAndSendMessage,
	createNewGroupChat,
	getRecentPrivateChats,
	getChat,
	addMemberToChat,
	removeMemberFromChat,
	getRecentGroupChats,
	getChatBetweenTwoUsers,
} from "../controllers/Chat.controller.js";

const router = Router();

router.get("/get-recent-private-chats", getRecentPrivateChats);
router.get("/get-recent-group-chats", getRecentGroupChats);
router.get("/get-chat", getChat);
router.get("/get-chat-between-two", getChatBetweenTwoUsers);

router.post("/create-new-group-chat", createNewGroupChat);
router.post("/create-new-chat-and-send-message", createNewChatAndSendMessage);
router.post("/add-member-to-chat", addMemberToChat);
router.post("/remove-member-from-chat", removeMemberFromChat);

export default router;

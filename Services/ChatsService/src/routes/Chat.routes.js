import { Router } from "express";
import {
	createNewChatAndSendMessage,
	createNewGroupChat,
	getRecentChats,
	getChat,
	addMemberToChat,
	removeMemberFromChat,
} from "../controllers/Chat.controller.js";

const router = Router();

router.get("/get-recent-chats", getRecentChats);
router.get("/get-chat", getChat);

router.post("/create-new-group-chat", createNewGroupChat);
router.post("/create-new-chat-and-send-message", createNewChatAndSendMessage);
router.post("/add-member-to-chat", addMemberToChat);
router.post("/remove-member-from-chat", removeMemberFromChat);

export default router;

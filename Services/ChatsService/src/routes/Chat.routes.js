import { Router } from "express";
import {
	createNewChatAndSendMessage,
	createNewGroupChat,
} from "../controllers/Chat.controller.js";

const router = Router();

router.post("/create-new-group-chat", createNewGroupChat);
router.post("/create-new-chat-and-send-message", createNewChatAndSendMessage);

export default router;

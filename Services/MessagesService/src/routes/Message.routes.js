import {
	sendMessage,
	getUnDeletedMessage,
	seenMessage,
	deleteMessage,
} from "../controllers/Message.controllers.js";
import { Router } from "express";

const router = Router();

router.get("/get-messages", getUnDeletedMessage);

router.post("/send-message", sendMessage);
router.post("/seen-message", seenMessage);
router.post("/delete-message", deleteMessage);

export default router;

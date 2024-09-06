import { Router } from "express";
import { sendMessageEvent } from "../controllers/message.controller.js";
const router = Router();

router.post("/send-message", sendMessageEvent);

export default router;

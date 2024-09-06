import {
	createNewWSSession,
	deleteWSSession,
	getWSSessions,
} from "../controllers/WSSession.controller.js";
import { Router } from "express";

const router = Router();

router.post("/get-ws-sessions", getWSSessions);

router.post("/create-new-ws-session", createNewWSSession);
router.post("/delete-ws-session", deleteWSSession);

export default router;

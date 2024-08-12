import {
	createNewWSSession,
	deleteWSSession,
	getWSSession,
} from "../controllers/WSSession.controller.js";
import { Router } from "express";

const router = Router();

router.get("/get-ws-session", getWSSession);

router.post("/create-new-ws-session", createNewWSSession);
router.post("/delete-ws-session", deleteWSSession);

export default router;

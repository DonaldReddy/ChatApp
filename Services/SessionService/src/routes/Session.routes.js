import { Router } from "express";
import {
	getSession,
	createSession,
	deleteSession,
} from "../controllers/Session.controller.js";

const router = Router();

router.get("/get-session", getSession);
router.post("/create-session", createSession);
router.post("/delete-session", deleteSession);

export default router;

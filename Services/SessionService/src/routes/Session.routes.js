import { Router } from "express";
import {
	getSession,
	createSession,
	deleteSession,
	validateSession
} from "../controllers/Session.controller.js";

const router = Router();

router.get("/get-session", getSession);
router.post("/create-session", createSession);
router.post("/delete-session", deleteSession);
router.post("/validate-session", validateSession);

export default router;

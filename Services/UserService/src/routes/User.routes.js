import { Router } from "express";
import {
	signUp,
	signIn,
	updateLastSeen,
} from "../controllers/User.controller.js";

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/update-last-seen", updateLastSeen);

export default router;

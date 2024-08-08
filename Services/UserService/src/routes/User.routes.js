import { Router } from "express";
import {
	signUp,
	signIn,
	updateLastSeen,
	getLastSeen,
	addFriend,
	removeFriend,
	blockUser,
	unblockUser,
} from "../controllers/User.controller.js";

const router = Router();

router.get("/get-last-seen", getLastSeen);

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/update-last-seen", updateLastSeen);
router.post("/add-friend", addFriend);
router.post("/remove-friend", removeFriend);
router.post("/block-user", blockUser);
router.post("/unblock-user", unblockUser);

export default router;

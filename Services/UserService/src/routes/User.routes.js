import { Router } from "express";
import {
	signUp,
	signIn,
	updateLastSeen,
	getLastSeen,
	getAllFriends,
	addFriend,
	isFriend,
	removeFriend,
	blockUser,
	unblockUser,
	signOut,
	getUsers,
	getProfile,
} from "../controllers/User.controller.js";

const router = Router();

router.get("/get-profile", getProfile);
router.get("/get-last-seen", getLastSeen);
router.get("/get-all-friends", getAllFriends);
router.get("/get-users", getUsers);

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.post("/update-last-seen", updateLastSeen);
router.post("/add-friend", addFriend);
router.post("/remove-friend", removeFriend);
router.post("/is-friend", isFriend);
router.post("/block-user", blockUser);
router.post("/unblock-user", unblockUser);

export default router;

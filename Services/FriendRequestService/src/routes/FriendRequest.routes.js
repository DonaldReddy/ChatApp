import { Router } from "express";
import {
	sendFriendRequest,
	acceptFriendRequest,
	ignoreFriendRequest,
	withdrawFriendRequest,
	getSentFriendRequests,
	getReceivedFriendRequests,
} from "../controllers/FriendRequest.controller.js";

const router = Router();

router.get("/get-sent-friend-requests", getSentFriendRequests);
router.get("/get-received-friend-requests", getReceivedFriendRequests);

router.post("/send-friend-request", sendFriendRequest);
router.post("/accept-friend-request", acceptFriendRequest);
router.post("/ignore-friend-request", ignoreFriendRequest);
router.post("/withdraw-friend-request", withdrawFriendRequest);

export default router;

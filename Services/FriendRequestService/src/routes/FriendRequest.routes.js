import { Router } from "express";
import {
	sendFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	cancelFriendRequest,
	getSentFriendRequests,
	getReceivedFriendRequests,
} from "../controllers/FriendRequest.controller.js";

const router = Router();

router.get("/get-sent-friend-requests", getSentFriendRequests);
router.get("/get-received-friend-requests", getReceivedFriendRequests);

router.post("/send-friend-request", sendFriendRequest);
router.post("/accept-friend-request", acceptFriendRequest);
router.post("/reject-friend-request", rejectFriendRequest);
router.post("/cancel-friend-request", cancelFriendRequest);

export default router;

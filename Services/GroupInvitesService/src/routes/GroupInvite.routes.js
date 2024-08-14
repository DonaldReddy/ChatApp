import {
	getReceivedGroupInvites,
	getSentGroupInvites,
	sendGroupInvites,
	acceptGroupInvite,
	rejectGroupInvite,
	deleteGroupInvite,
} from "../controllers/GroupInvite.controller.js";
import { Router } from "express";

const router = Router();

router.get("/get-received-group-invites", getReceivedGroupInvites);
router.get("/get-sent-group-invites", getSentGroupInvites);

router.post("/send-group-invites", sendGroupInvites);
router.post("/accept-group-invite", acceptGroupInvite);
router.post("/reject-group-invite", rejectGroupInvite);
router.post("/delete-group-invite", deleteGroupInvite);

export default router;

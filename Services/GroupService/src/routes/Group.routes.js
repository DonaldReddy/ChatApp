import { Router } from "express";
import {
	createNewGroup,
	deleteGroup,
	promoteToAdmin,
	demoteToMember,
	getGroup,
} from "../controllers/Group.controller.js";

const router = Router();

router.get("/get-group", getGroup);

router.post("/create-new-group", createNewGroup);
router.post("/delete-group", deleteGroup);
router.post("/promote-to-admin", promoteToAdmin);
router.post("/demote-to-member", demoteToMember);

export default router;

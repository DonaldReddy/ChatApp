import WSSession from "../models/WSSession.schema.js";

async function createNewWSSession(req, res) {
	try {
		const { userName, wsId } = req.body;
		await WSSession.deleteMany({ userName });
		await new WSSession({ userName, wsId }).save();
		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

async function deleteWSSession(req, res) {
	try {
		const { userName, wsId } = req.body;
		const query = {};
		if (userName) query.userName = userName;
		if (wsId) query.wsId = wsId;
		await WSSession.deleteMany(query);
		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

async function getWSSessions(req, res) {
	try {
		const { userNames } = req.body;
		const sessions = await WSSession.find({
			userName: { $in: userNames },
		}).select(["userName", "wsId", "-_id"]);
		res.status(200).send({ status: true, sessions });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

export { createNewWSSession, getWSSessions, deleteWSSession };

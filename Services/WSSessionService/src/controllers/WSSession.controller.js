import WSSession from "../models/WSSession.schema.js";

async function createNewWSSession(req, res) {
	try {
		const { userName, wsID } = req.body;
		await WSSession.deleteMany({ userName });
		await new WSSession({ userName, wsID }).save();
		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

async function deleteWSSession(req, res) {
	try {
		const { userName, wsID } = req.body;
		console.log(req.body);

		const query = {};
		if (userName) query.userName = userName;
		if (wsID) query.wsID = wsID;
		await WSSession.deleteMany(query);
		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

async function getWSSession(req, res) {
	try {
		const { userName, wsID } = req?.query;
		const query = {};
		if (userName) query.userName = userName;
		if (wsID) query.wsID = wsID;
		const session = await WSSession.findOne(query).select([
			"userName",
			"wsID",
			"-_id",
		]);
		if (!session) throw new Error("No session for provided username");
		res.status(200).send({ status: true, data: { session } });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

export { createNewWSSession, getWSSession, deleteWSSession };

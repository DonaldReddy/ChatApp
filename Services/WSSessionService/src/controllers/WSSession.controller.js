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
		console.log(req.body);

		const query = {};
		if (userName) query.userName = userName;
		if (wsId) query.wsId = wsId;
		await WSSession.deleteMany(query);
		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

async function getWSSession(req, res) {
	try {
		const { userName, wsId } = req?.query;
		const query = {};
		if (userName) query.userName = userName;
		if (wsId) query.wsId = wsId;
		const session = await WSSession.findOne(query).select([
			"userName",
			"wsId",
			"-_id",
		]);
		if (!session) throw new Error("No session for provided username");
		res.status(200).send({ status: true, data: { session } });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

export { createNewWSSession, getWSSession, deleteWSSession };

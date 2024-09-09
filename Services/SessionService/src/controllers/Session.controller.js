import Session from "../models/Session.schema.js";
import services from "../../services.js";

async function createSession(req, res) {
	try {
		const { userName, refreshToken, accessToken } = req?.body;
		await Session.deleteMany({ userName });
		const newSession = new Session({ userName, refreshToken, accessToken });
		await newSession.save();
		res.status(200).send({ status: true });
	} catch (error) {
		console.log(error.message);

		res.status(400).send({ status: false, error: error.message });
	}
}

async function getSession(req, res) {
	try {
		const { userName, refreshToken } = req?.query;
		const query = {};
		if (userName) query.userName = userName;
		if (refreshToken) query.refreshToken = refreshToken;
		const session = await Session.findOne(query).select(
			"userName refreshToken accessToken",
		);
		if (!session) throw new Error("No session for provided username");
		res.status(200).send({ status: true, session });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

async function deleteSession(req, res) {
	try {
		const { userName, refreshToken } = req?.body;
		const query = {};
		if (userName) query.userName = userName;
		if (refreshToken) query.refreshToken = refreshToken;
		await Session.deleteMany({ userName });
		res.status(200).send({ status: true });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

async function validateSession(req, res) {
	try {
		const { userName } = req?.body;
		const session = await Session.findOne({ userName });
		res.status(200).send({ status: session ? true : false });
	} catch (error) {
		res.status(400).send({ status: false, error: error.message });
	}
}

export { createSession, getSession, deleteSession, validateSession };

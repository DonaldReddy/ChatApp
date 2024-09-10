import jwt from "jsonwebtoken";
import axios from "axios";
import services from "../services.js";

async function verifyJWT(req, res, next) {
	try {
		const { ACCESS_TOKEN, REFRESH_TOKEN } = req.cookies;

		// Check if access token exists
		if (!ACCESS_TOKEN) {
			throw new Error("Access token is missing");
		}

		// Verify access token
		const decodedAccessToken = jwt.verify(
			ACCESS_TOKEN,
			process.env.ACCESS_TOKEN_SECRET,
		);
		if (!decodedAccessToken) {
			return res.status(401).send("Not authorized");
		}

		// Fetch session data
		const { data } = await axios.get(
			`${services.session.target}/api/v1/session/get-session?userName=${decodedAccessToken.userName}`,
		);

		if (!data.status) {
			throw new Error("Session not found");
		}

		const session = data.session;

		if (session.accessToken != ACCESS_TOKEN) {
			return clearSessionAndRespond(req, res);
		}

		if (data) return next();
	} catch (accessError) {
		// Handle refresh token verification
		return handleRefreshToken(req, res, next);
	}
}

async function handleRefreshToken(req, res, next) {
	try {
		const { REFRESH_TOKEN } = req.cookies;

		if (!REFRESH_TOKEN) {
			throw new Error("Refresh token is missing");
		}

		const decodedRefreshToken = jwt.verify(
			REFRESH_TOKEN,
			process.env.REFRESH_TOKEN_SECRET,
		);

		// Fetch session with refresh token
		const { data: currentSession } = await axios.get(
			`${services.session.target}/api/v1/session/get-session?refreshToken=${REFRESH_TOKEN}`,
		);

		if (!currentSession.status) {
			throw new Error("Session not found");
		}

		if (currentSession.userName !== decodedRefreshToken.userName) {
			throw new Error("User mismatch");
		}

		// Generate new access token
		const newAccessToken = signJWT(currentSession.userName);

		// Set the new access token in cookies
		res.cookie("ACCESS_TOKEN", newAccessToken, {
			httpOnly: true,
			sameSite: "None",
			secure: true,
			expires: new Date(Date.now() + 86400 * 1000), // 1 day
		});

		return next();
	} catch (refreshError) {
		return clearSessionAndRespond(req, res);
	}
}

async function clearSessionAndRespond(req, res) {
	try {
		if (req.cookies.REFRESH_TOKEN) {
			await axios.post(
				`${services.session.target}/api/v1/session/delete-session`,
				{ refreshToken: req.cookies.REFRESH_TOKEN },
			);
		}

		// Clear the cookies
		res.clearCookie("ACCESS_TOKEN", {
			httpOnly: true,
			sameSite: "None",
			secure: true,
		});
		res.clearCookie("REFRESH_TOKEN", {
			httpOnly: true,
			sameSite: "None",
			secure: true,
		});

		return res.status(401).send({ status: false, error: "Session expired" });
	} catch (error) {
		return res.status(500).send({ status: false, error: "Session expired" });
	}
}

export { verifyJWT };

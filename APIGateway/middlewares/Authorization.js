import jwt from "jsonwebtoken";
import axios from "axios";
import services from "../services.js";

async function verifyJWT(req, res, next) {
	try {
		const { ACCESS_TOKEN, REFRESH_TOKEN } = req.cookies;

		if (!ACCESS_TOKEN) {
			throw new Error("Access token is missing");
		}

		const decodedAccessToken = jwt.verify(
			ACCESS_TOKEN,
			process.env.ACCESS_TOKEN_SECRET,
		);

		if (!decodedAccessToken) {
			return res.status(401).send("Not authorized");
		}

		const { data: session } = await axios.get(
			`${services.session.target}/api/v1/session/get-session?userName=${decodedAccessToken.userName}`,
		);

		if (!session.status) throw new Error("Session not found");

		return next();
	} catch (accessError) {
		console.log("Access token verification failed:", accessError.message);
		const { REFRESH_TOKEN } = req.cookies;
		try {
			if (!REFRESH_TOKEN) {
				throw new Error("Refresh token is missing");
			}

			const decodedRefreshToken = jwt.verify(
				REFRESH_TOKEN,
				process.env.REFRESH_TOKEN_SECRET,
			);

			const { data: currentSession } = await axios.get(
				`${services.session.target}/api/v1/session/get-session?refreshToken=${REFRESH_TOKEN}`,
			);

			if (!currentSession.status) {
				throw new Error("Session not found");
			}

			if (currentSession.userName !== decodedRefreshToken.userName) {
				throw new Error("User mismatch");
			}

			console.log("Current session:", currentSession);

			const newAccessToken = signJWT(currentSession.userName);

			res.cookie("ACCESS_TOKEN", newAccessToken, {
				httpOnly: true,
				sameSite: "None",
				secure: true,
				expires: new Date(Date.now() + 86400 * 1000), // 1 day
			});

			return next();
		} catch (refreshError) {
			try {
				console.log("Refresh token verification failed:", refreshError.message);

				if (req.cookies.REFRESH_TOKEN) {
					await axios.post(
						`${services.session.target}/api/v1/session/delete-session`,
						{
							refreshToken: req.cookies.REFRESH_TOKEN,
						},
					);
				}

				// Clear tokens
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

				return res.status(401).send("Session expired");
			} catch (error) {
				res.send("Invalid request");
			}
		}
	}
}

export { verifyJWT };

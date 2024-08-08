import jwt from "jsonwebtoken";
import Session from "./../schema/Session.schema.js";
import { signJWT } from "../utils/generateJWT.utils.js";

async function verifyJWT(req, res, next) {
	try {
		const ACCESS_TOKEN = req.cookies.ACCESS_TOKEN;
		const REFRESH_TOKEN = req.cookies.REFRESH_TOKEN;

		console.log(
			"Access Token:",
			ACCESS_TOKEN,
			"\n",
			"Refresh Token:",
			REFRESH_TOKEN
		);

		const decodedAccessToken = jwt.verify(
			ACCESS_TOKEN,
			process.env.ACCESS_TOKEN_SECRET
		);

		console.log("Decoded Access Token:", decodedAccessToken);

		if (decodedAccessToken == null) {
			return res.status(401).send("Not authorized");
		}

		const session = await Session.findOne({
			user: decodedAccessToken.user,
			refreshToken: REFRESH_TOKEN,
		});

		if (session == null) throw new Error("User mismatch");

		req.user = decodedAccessToken.user;
		next();
	} catch (error) {
		console.log("Access token verification failed:", error.message);

		try {
			const REFRESH_TOKEN = req.cookies.REFRESH_TOKEN;
			const decodedRefreshToken = jwt.verify(
				REFRESH_TOKEN,
				process.env.REFRESH_TOKEN_SECRET
			);

			const current_session = await Session.findOne({
				refreshToken: REFRESH_TOKEN,
			});

			if (!current_session) {
				throw new Error("Session not found");
			}

			if (current_session.user !== decodedRefreshToken.user) {
				throw new Error("User mismatch");
			}

			console.log("Current session:", current_session);

			const newAccessToken = signJWT(current_session.user);

			res.cookie("ACCESS_TOKEN", newAccessToken, {
				httpOnly: true,
				sameSite: "None",
				secure: true,
			});

			req.user = decodedRefreshToken.user;

			next();
		} catch (refreshError) {
			console.log("Refresh token verification failed:", refreshError.message);

			const REFRESH_TOKEN = req.cookies.REFRESH_TOKEN;
			await Session.deleteOne({ refreshToken: REFRESH_TOKEN });

			res.cookie("ACCESS_TOKEN", " ", {
				httpOnly: true,
				sameSite: "None",
				secure: true,
			});
			res.cookie("REFRESH_TOKEN", " ", {
				httpOnly: true,
				sameSite: "None",
				secure: true,
			});

			return res.status(401).send("Session expired");
		}
	}
}

export { verifyJWT };

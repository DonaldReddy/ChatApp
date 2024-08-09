import jwt from "jsonwebtoken";
import { signJWT } from "../utils/generateJWT.utils.js";

async function verifyJWT(req, res, next) {
	console.log(req.path);

	// try {
	// 	const ACCESS_TOKEN = req.cookies.ACCESS_TOKEN;
	// 	const REFRESH_TOKEN = req.cookies.REFRESH_TOKEN;

	// 	console.log(
	// 		"Access Token:",
	// 		ACCESS_TOKEN,
	// 		"\n",
	// 		"Refresh Token:",
	// 		REFRESH_TOKEN
	// 	);

	// 	const decodedAccessToken = jwt.verify(
	// 		ACCESS_TOKEN,
	// 		process.env.ACCESS_TOKEN_SECRET
	// 	);

	// 	console.log("Decoded Access Token:", decodedAccessToken);

	// 	if (decodedAccessToken == null) {
	// 		return res.status(401).send("Not authorized");
	// 	}

	// 	const response = await axios.get(
	// 		`http://localhost:3008/api/v1/session/get-session?userName=${decodedAccessToken.userName}`
	// 	);

	// 	const session = response.data;

	// 	if (!session.status) throw new Error("Session not found");

	// 	req.user = decodedAccessToken.user;
	// 	next();
	// } catch (error) {
	// 	console.log("Access token verification failed:", error.message);

	// 	try {
	// 		const REFRESH_TOKEN = req.cookies.REFRESH_TOKEN;
	// 		const decodedRefreshToken = jwt.verify(
	// 			REFRESH_TOKEN,
	// 			process.env.REFRESH_TOKEN_SECRET
	// 		);

	// 		const response = await axios.get(
	// 			`http://localhost:3008/api/v1/session/get-session?refreshToken=${REFRESH_TOKEN}`
	// 		);

	// 		const current_session = response.data;

	// 		if (!current_session.status) {
	// 			throw new Error("Session not found");
	// 		}

	// 		if (current_session.userName !== decodedRefreshToken.userName) {
	// 			throw new Error("User mismatch");
	// 		}

	// 		console.log("Current session:", current_session);

	// 		const newAccessToken = signJWT(current_session.userName);

	// 		res.cookie("ACCESS_TOKEN", newAccessToken, {
	// 			httpOnly: true,
	// 			sameSite: "None",
	// 			secure: true,
	// 			expires: new Date(Date.now() + 86400 * 1000),
	// 		});

	// 		req.user = decodedRefreshToken.user;

	// 		next();
	// 	} catch (refreshError) {
	// 		console.log("Refresh token verification failed:", refreshError.message);

	// 		const REFRESH_TOKEN = req.cookies.REFRESH_TOKEN;
	// 		await axios.post(`http://localhost:3008/api/v1/session/delete-session`, {
	// 			refreshToken: REFRESH_TOKEN,
	// 		});

	// 		res.cookie("ACCESS_TOKEN", " ", {
	// 			httpOnly: true,
	// 			sameSite: "None",
	// 			secure: true,
	// 		});
	// 		res.cookie("REFRESH_TOKEN", " ", {
	// 			httpOnly: true,
	// 			sameSite: "None",
	// 			secure: true,
	// 		});

	// 		return res.status(401).send("Session expired");
	// 	}
	// }
	console.log("applied");

	next();
}

export { verifyJWT };

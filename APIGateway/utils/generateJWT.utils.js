import jwt from "jsonwebtoken";

const signJWT = (user = "") =>
	jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "1d",
	});

const signJWTRefresh = (user = "") =>
	jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

export { signJWT, signJWTRefresh };

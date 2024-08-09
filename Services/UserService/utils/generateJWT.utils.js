import jwt from "jsonwebtoken";

const signJWT = (userName = "") =>
	jwt.sign({ userName }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "1d",
	});

const signJWTRefresh = (userName = "") =>
	jwt.sign({ userName }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

export { signJWT, signJWTRefresh };

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { verifyJWT } from "./middlewares/Authorization.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
	cors({
		credentials: true,
	})
);
app.use(cookieParser());
app.use((req, res, next) => {
	if (req.path.includes("sign")) return next();
	verifyJWT(req, res, next);
});

export default app;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { verifyJWT } from "./middlewares/Authorization.js";

dotenv.config();

const app = express();

app.use(cors());
app.use((req, res, next) => {
	if (req.path.includes("sign")) return next();
	verifyJWT(req, res, next);
});

export default app;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/User.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = ["*.donaldreddy.xyz"];
const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);
		// Only allow whitelisted origins
		if (allowedOrigins.some((domain) => new RegExp(domain).test(origin))) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};

app.use(cors(corsOptions));

app.use("/api/v1/user", router);

export default app;

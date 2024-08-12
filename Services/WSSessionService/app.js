import express from "express";
import cors from "cors";
import router from "./src/routes/ws.routes.js";
import axios from "axios";

const app = express();

app.use(express.json());

const allowedOrigins = ["donaldreddy.xyz", /\.donaldreddy\.xyz$/];
const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);

		// Check if the origin is allowed
		if (
			allowedOrigins.some((allowedOrigin) => {
				return typeof allowedOrigin === "string"
					? origin === allowedOrigin
					: allowedOrigin.test(origin);
			})
		) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};

app.use(cors(corsOptions));

app.use("/api/v1/ws-session", router);

export default app;

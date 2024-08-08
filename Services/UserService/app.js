import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/User.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = ["donaldreddy.xyz", /\.donaldreddy\.xyz$/];
const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		console.log("Request origin:", origin);

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

app.use("/api/v1/user", router);

export default app;

import express from "express";
import cors from "cors";
import router from "./src/routes/User.routes.js";
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

app.use((req, res, next) => {
	if (!req.headers["x-user-name"] && !req.path.includes("sign"))
		return res.send("Invalid Headers");
	req.userName = req.headers["x-user-name"];
	axios.defaults.headers.common["x-user-name"] = req.userName;
	return next();
});

app.use("/api/v1/user", router);

export default app;

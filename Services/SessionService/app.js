import express from "express";
import cors from "cors";
import router from "./src/routes/Session.routes.js";
import axios from "axios";

const app = express();
app.use(express.json());

app.use(
	cors({
		credentials: true,
		origin: function (origin, callback) {
			if (
				!origin ||
				/\.donaldreddy\.xyz$/.test(origin) ||
				(typeof origin === "string" ? origin.includes("localhost") : false)
			) {
				callback(null, true);
			} else {
				callback("Not allowed by CORS");
			}
		},
	}),
);
app.use("/api/v1/session", router);

export default app;

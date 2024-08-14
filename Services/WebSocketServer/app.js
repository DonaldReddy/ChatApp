import express from "express";
import cors from "cors";

const app = express();

app.use(
	cors({
		credentials: true,
		origin: function (origin, callback) {
			console.log(origin);
			if (!origin || /\.donaldreddy\.xyz$/.test(origin)) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
	}),
);

export default app;

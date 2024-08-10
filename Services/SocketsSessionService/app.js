import express from "express";
import cors from "cors";

const app = express();

// const allowedOrigins = [/^https?:\/\/([a-z0-9-]+\.)?donaldreddy\.xyz(:\d+)?$/];

// const corsOptions = {
	// origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		// if (origin == null || !origin) return callback(null, true);
		// console.log(origin);

		// Only allow whitelisted origins
		// if (allowedOrigins.some((domain) => new RegExp(domain).test(origin))) {
		// return callback(null, true);
		// } else {
		// callback(new Error("Not allowed by CORS"));
		// }
	// },
// };

app.use(cors());

app.use((req, res, next) => {
	console.log(req.path);
	next();
});

app.get("/", (req, res) => {
	res.send("wswsws");
});

export default app;

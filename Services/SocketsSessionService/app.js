import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.use((req, res, next) => {
	console.log(req.path);
	next();
});

app.get("/", (req, res) => {
	res.send("wswsws");
});

export default app;

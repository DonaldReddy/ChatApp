import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import services from "./services.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

services.forEach((service) => {
	// Proxy options
	const { route, target } = service;
	const proxyOptions = {
		target,
		changeOrigin: true,
		pathRewrite: {
			[`^${route}`]: target,
		},
		logLevel: "debug",
	};
	app.use(route, createProxyMiddleware(proxyOptions));
});

app.listen(3000, () => {
	console.log("listening");
});

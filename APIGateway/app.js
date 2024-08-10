import express from "express";
import cors from "cors";
import { createProxyMiddleware, loggerPlugin } from "http-proxy-middleware";
import services from "./services.js";
import { verifyJWT } from "./middlewares/Authorization.js";
import cookieParser from "cookie-parser";

const app = express();

// CORS configuration
app.use(
	cors({
		credentials: true,
		origin: "*", // Adjust CORS policy as needed
	}),
);

app.use(cookieParser());

// Apply verifyJWT middleware globally, except for specific routes
app.use((req, res, next) => {
	if (
		req.path.includes("/sign") ||
		req.path === "/" ||
		req.path.includes("/socket.io/")
	) {
		return next(); // Skip JWT verification for these routes
	}
	verifyJWT(req, res, next); // Apply JWT verification for all other routes
});

// Proxy setup
const simpleRequestLogger = (proxyServer, options) => {
	proxyServer.on("proxyReq", (proxyReq, req, res) => {
		console.log(`Request: ${req.method} ${req.originalUrl}`);
		console.log(`Proxying to: ${proxyReq.headers?.host}${proxyReq.path}`);
	});
};

services.forEach((service) => {
	const { route, target, type } = service;
	const proxyOptions = {
		target,
		changeOrigin: true,
		ws: type === "ws",
		logLevel: "debug",
		plugins: [loggerPlugin, simpleRequestLogger],
	};

	console.log(`Setting up proxy for ${route} to ${target}`);
	app.use(route, createProxyMiddleware(proxyOptions));
});

export default app;

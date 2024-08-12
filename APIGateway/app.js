import express from "express";
import cors from "cors";
import httpProxy from "http-proxy";
import { createServer } from "http";
import services from "./services.js";
import { verifyJWT } from "./middlewares/Authorization.js";
import cookieParser from "cookie-parser";

const app = express();
const server = createServer(app);
const proxy = httpProxy.createProxyServer({
	changeOrigin: true,
	timeout: 5000,
});

proxy.on("error", (err, req, res) => {
	if (err.code === "ECONNRESET") {
		res.end("The connection was reset. Please try again later.");
	} else {
		res.end("An error occurred while processing your request.");
	}
});

// CORS configuration
app.use(
	cors({
		credentials: true,
		origin: /\.donaldreddy\.xyz$/,
	}),
);

app.use(cookieParser());

// Apply verifyJWT middleware globally, except for specific routes
const skipJWTVerification = ["/sign-in", "/sign-up", "/socket.io"];
app.use((req, res, next) => {
	if (
		skipJWTVerification.some((value) => req.path.includes(value)) ||
		req.path === "/"
	) {
		return next(); // Skip JWT verification for these routes
	}
	verifyJWT(req, res, next); // Apply JWT verification for all other routes
});

// Set up proxies
Object.keys(services).forEach((service) => {
	const { route, target, type } = services[service];

	console.log(`Setting up proxy for ${route} to ${target}`);

	app.use(route, (req, res) => {
		req.originalUrl;
		console.log(req.url, req.originalUrl);

		proxy.web(req, res, { target, ws: type == "ws" }, (err) => {
			console.error(`Error proxying request to ${target}: ${err.message}`);
			res.status(500).send("Proxy error");
		});
	});
});

// Handling WebSocket connections
server.on("upgrade", (req, socket, head) => {
	try {
		const target = services.ws.target;
		proxy.ws(req, socket, head, { target });
	} catch (error) {
		console.log(error.message);
	}
});

export default server;

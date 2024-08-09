import app from "./app.js";
import { createProxyMiddleware } from "http-proxy-middleware";
import services from "./services.js";

const PORT = process.env.PORT || 3000;

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


app.listen(PORT, () => {
	console.log(`Gateway is running at ${PORT}`);
});

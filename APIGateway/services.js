const services = [
	{
		route: "/user",
		target: process.env.IS_DEV
			? "http://localhost:3001/"
			: "https://chatapp-user-service.onrender.com",
	},
	{
		route: "/friend-request",
		target: process.env.IS_DEV
			? "http://localhost:3004/"
			: "https://chatapp-user-service.onrender.com",
	},
	{
		route: "/socket.io",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3007/"
				: "https://chatapp-websocket-service.onrender.com",
		type: "ws",
	},
];

export default services;

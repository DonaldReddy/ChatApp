const services = {
	chat: {
		route: "/chat",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3001"
				: "https://chat.services.hola.donaldreddy.xyz",
	},
	group: {
		route: "/group",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3004"
				: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
};

export default services;

const services = {
	chat: {
		route: "/chat",
		target: process.env.IS_DEV
			? "http://localhost:3001"
			: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
	group: {
		route: "/group",
		target: process.env.IS_DEV
			? "http://localhost:3004"
			: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
};

export default services;

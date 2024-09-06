const services = {
	chat: {
		route: "/chat",
		target: process.env.IS_DEV
			? "http://localhost:3001"
			: "https://chatapp-websocket-service.onrender.com/socket.io",
	},
	user: {
		route: "/user",
		target: process.env.IS_DEV
			? "http://localhost:3007"
			: "https://chatapp-user-service.onrender.com",
	},
};

export default services;

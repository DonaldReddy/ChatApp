const services = {
	user: {
		route: "/user",
		target: process.env.IS_DEV
			? "http://localhost:3001"
			: "https://chatapp-user-service.onrender.com",
	},
	friendRequest: {
		route: "/friend-request",
		target: process.env.IS_DEV
			? "http://localhost:3004"
			: "https://chatapp-user-service.onrender.com",
	},
	session: {
		route: "/session",
		target: process.env.IS_DEV
			? "http://localhost:3008"
			: "https://chatapp-user-service.onrender.com",
	},
	socketIO: {
		route: "/socket.io",
		target: process.env.IS_DEV
			? "http://localhost:3007/socket.io"
			: "https://chatapp-websocket-service.onrender.com/socket.io",
		type: "ws",
	},
};

export default services;

const services = {
	friendRequest: {
		route: "/friend-request",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3004"
				: "https://chatapp-user-service.onrender.com",
	},
	session: {
		route: "/session",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3006"
				: "https://chatapp-session-service.onrender.com",
	},
};

export default services;

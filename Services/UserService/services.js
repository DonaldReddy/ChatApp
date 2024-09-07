const services = {
	friendRequest: {
		route: "/friend-request",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3002"
				: "https://friend-request.services.hola.donaldreddy.xy",
	},
	session: {
		route: "/session",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3006"
				: "https://session.services.hola.donaldreddy.xyz",
	},
};

export default services;

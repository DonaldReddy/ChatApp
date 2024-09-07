const services = {
	wsSession: {
		route: "/ws-session",
		target:
			process.env.IS_DEV == "true"
				? "http://localhost:3009"
				: "https://ws-session.services.hola.donaldreddy.xyz",
	},
};

export default services;

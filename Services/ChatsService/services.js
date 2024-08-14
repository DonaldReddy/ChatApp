const services = {
	group: {
		route: "/group",
		target: process.env.IS_DEV
			? "http://localhost:3004"
			: "https://chatapp-user-service.onrender.com",
	},
};

export default services;

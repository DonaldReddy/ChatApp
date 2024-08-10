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
];

export default services;

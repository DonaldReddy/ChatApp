import User from "../models/User.schema.js";
import bcrypt from "bcrypt";
import moment from "moment-timezone";
import axios from "axios";
import { signJWT, signJWTRefresh } from "../../utils/generateJWT.utils.js";
import services from "../../services.js";

// Get user profile
// Get user profile
async function getProfile(req, res) {
	try {
		const { userName } = req.query;

		// Ensure the userName is indexed in MongoDB for faster queries
		const user = await User.findOne({ userName })
			.select("name userName friends")
			.lean(); // Use lean() for better performance when Mongoose document methods aren't needed

		if (!user) {
			return res
				.status(404)
				.send({ status: false, error: "User doesn't exist" });
		}

		const { name, friends } = user;

		res.status(200).send({
			status: true,
			profile: {
				name,
				userName,
				numberOfFriends: friends.length,
			},
		});
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

// Sign up a new user
async function signUp(req, res) {
	try {
		const { userName, password, name } = req.body;

		// Check if the user already exists
		const existingUser = await User.findOne({ userName });
		if (existingUser)
			return res
				.status(400)
				.send({ status: false, error: "User already exists" });

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user instance
		const newUser = new User({
			userName,
			password: hashedPassword,
			name,
		});

		const ACCESS_TOKEN = signJWT(userName);
		const REFRESH_TOKEN = signJWTRefresh(userName);

		const response = await axios.post(
			`${services.session.target}/api/v1/session/create-session`,
			{
				userName: userName,
				refreshToken: REFRESH_TOKEN,
			},
		);

		if (!response.data.status)
			throw new Error("Can't create session right now");

		res.cookie("ACCESS_TOKEN", ACCESS_TOKEN, {
			httpOnly: true,
			sameSite: "None",
			secure: true,
			expires: new Date(Date.now() + 86400 * 1000),
		});
		res.cookie("REFRESH_TOKEN", REFRESH_TOKEN, {
			httpOnly: true,
			sameSite: "None",
			secure: true,
			expires: new Date(Date.now() + 14 * 86400 * 1000),
		});

		// Save the user to the database
		await newUser.save();

		res.status(200).send({ status: true, data: { user: newUser.userName } });
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

// Sign in an existing user
async function signIn(req, res) {
	try {
		const { userName, password } = req.body;

		// Find the user by userName
		const user = await User.findOne({ userName });
		if (!user)
			return res
				.status(404)
				.send({ status: false, error: "User doesn't exist" });

		// Compare the provided password with the stored hash
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid)
			return res
				.status(401)
				.send({ status: false, error: "Invalid credentials" });

		const ACCESS_TOKEN = signJWT(userName);
		const REFRESH_TOKEN = signJWTRefresh(userName);

		const response = await axios.post(
			`${services.session.target}/api/v1/session/create-session`,
			{
				userName: userName,
				refreshToken: REFRESH_TOKEN,
			},
		);
		console.log(response.data);

		if (!response.data.status)
			throw new Error("Can't create session right now");

		console.log("user", userName);

		console.log(ACCESS_TOKEN, REFRESH_TOKEN);

		res.cookie("ACCESS_TOKEN", ACCESS_TOKEN, {
			httpOnly: true,
			sameSite: "None",
			secure: true,
			expires: new Date(Date.now() + 86400 * 1000),
		});
		res.cookie("REFRESH_TOKEN", REFRESH_TOKEN, {
			httpOnly: true,
			sameSite: "None",
			secure: true,
			expires: new Date(Date.now() + 14 * 86400 * 1000),
		});

		// Update lastSeen timestamp
		await updateLastSeen(req, res, false);

		res.status(200).send({ status: true, data: { user: user.userName } });
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

// Sign out user
async function signOut(req, res) {
	try {
		const { userName } = req.body;

		// Delete session
		const response = await axios.post(
			`${services.session.target}/api/v1/session/delete-session`,
			{
				userName: userName,
			},
		);

		if (!response.data.status)
			throw new Error("Can't delete session right now");

		res.clearCookie("ACCESS_TOKEN", {
			httpOnly: true,
			sameSite: "None",
			secure: true,
		});
		res.clearCookie("REFRESH_TOKEN", {
			httpOnly: true,
			sameSite: "None",
			secure: true,
		});

		// Update lastSeen timestamp
		await updateLastSeen(req, res, false);

		res.status(200).send({ status: true });
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

// Update lastSeen timestamp for a user
async function updateLastSeen(req, res, isHTTP = true) {
	try {
		const { userName } = req.body;

		// Find the user by userName
		const user = await User.findOne({ userName });
		if (!user)
			return res
				.status(404)
				.send({ status: false, error: "User doesn't exist" });

		// Update lastSeen to the current time
		user.lastSeen = moment().tz("Asia/Kolkata").toDate();
		await user.save();

		if (isHTTP) {
			res.status(200).send({
				status: true,
				data: { user: user.userName, lastSeen: user.lastSeen },
			});
		}
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

// Get lastSeen timestamp for a user
async function getLastSeen(req, res) {
	try {
		const { userName } = req.query;

		// Find the user by userName
		const user = await User.findOne({ userName });
		if (!user)
			return res
				.status(404)
				.send({ status: false, error: "User doesn't exist" });

		res.status(200).send({
			status: true,
			data: { user: user.userName, lastSeen: user.lastSeen },
		});
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

// Get all friends of user
async function getAllFriends(req, res) {
	try {
		const { userName, search } = req.query;

		// Find the user by userName and get the friends array
		const user = await User.findOne({ userName }).select("friends");

		if (!user) {
			return res.status(404).send({ status: false, message: "User not found" });
		}

		// Create a filter for the search functionality
		let searchFilter = {};

		if (search) {
			searchFilter = {
				$or: [
					{ name: { $regex: search, $options: "i" } },
					{ userName: { $regex: search, $options: "i" } },
				],
			};
		}

		// Find the name and userName of each friend in the friends array, filtered by search
		const friends = await User.find(
			{ userName: { $in: user.friends }, ...searchFilter },
			"name userName",
		);

		// Send the populated and filtered friends array
		res.status(200).send({ status: true, friends });
	} catch (error) {
		console.error("Error in getAllFriends:", error);
		res.status(500).send({ status: false, error: "Internal Server Error" });
	}
}

// Get users
async function getUsers(req, res) {
	try {
		let { search, page = 1 } = req.query;
		const limit = 10;
		const skip = (page - 1) * limit;

		// Normalize the search string
		search = search ? search.trim().toLowerCase() : "";

		// Split the search string into multiple terms
		const searchTerms = search.split(" ");

		const users = await User.aggregate([
			{
				$match: {
					$or: searchTerms.map((term) => ({
						$or: [
							{ name: { $regex: term, $options: "i" } },
							{ userName: { $regex: term, $options: "i" } },
						],
					})),
				},
			},
			{
				$addFields: {
					weightedScore: {
						$add: [
							{
								$multiply: [
									{
										$cond: [
											{
												$regexMatch: {
													input: "$name",
													regex: search,
													options: "i",
												},
											},
											1,
											0,
										],
									},
									5, // Weight for the name field
								],
							},
							{
								$multiply: [
									{
										$cond: [
											{
												$regexMatch: {
													input: "$userName",
													regex: search,
													options: "i",
												},
											},
											1,
											0,
										],
									},
									10, // Weight for the userName field
								],
							},
						],
					},
				},
			},
			{
				$sort: { weightedScore: -1 }, // Sort by weighted score
			},
			{
				$project: {
					_id: 0,
					name: 1,
					userName: 1,
					weightedScore: 1,
				},
			},
			{
				$skip: skip,
			},
			{
				$limit: limit,
			},
		]);

		// Count the total number of matching documents
		const totalUsers = await User.countDocuments({
			$or: searchTerms.map((term) => ({
				$or: [
					{ name: { $regex: term, $options: "i" } },
					{ userName: { $regex: term, $options: "i" } },
				],
			})),
		});

		// Send the users array and total count
		res.status(200).send({ status: true, users, totalUsers });
	} catch (error) {
		console.error("Error in getUsers:", error);
		res.status(500).send({ status: false, error: "Internal Server Error" });
	}
}

// Add a friend for a user
async function addFriend(req, res) {
	try {
		const { userName, friendUserName } = req.body;

		// Check if the user and friend are the same person
		if (userName === friendUserName)
			return res.status(400).send({
				status: false,
				error: "User cannot add themselves as a friend.",
			});

		// Find the user and the friend by userName
		const user = await User.findOne({ userName });
		if (!user)
			return res
				.status(404)
				.send({ status: false, error: "User does not exist." });

		const friend = await User.findOne({ userName: friendUserName });
		if (!friend)
			return res
				.status(404)
				.send({ status: false, error: "Friend does not exist." });

		// Check if the friend is already in the user's friend list
		if (user.friends.includes(friendUserName)) {
			return res.status(400).send({
				status: false,
				error: "This user is already in your friend list.",
			});
		}

		// Add each other as friends
		user.friends.push(friendUserName);
		friend.friends.push(userName);

		// Save both users' updated data
		await Promise.all([user.save(), friend.save()]);

		res
			.status(200)
			.send({ status: true, message: "Friend added successfully." });
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

// Remove a friend for a user
async function removeFriend(req, res) {
	try {
		const { userName, friendUserName } = req.body;

		// Check if the user and friend are the same person
		if (userName === friendUserName)
			return res.status(400).send({
				status: false,
				error: "User cannot remove themselves as a friend.",
			});

		// Find the user and the friend by userName
		const user = await User.findOne({ userName });
		if (!user)
			return res
				.status(404)
				.send({ status: false, error: "User does not exist." });

		const friend = await User.findOne({ userName: friendUserName });
		if (!friend)
			return res
				.status(404)
				.send({ status: false, error: "Friend does not exist." });

		// Check if the friend is in the user's friend list
		if (!user.friends.includes(friendUserName)) {
			return res.status(400).send({
				status: false,
				error: "This user is not in your friend list.",
			});
		}

		// Remove each other as friends
		user.friends.pull(friendUserName);
		friend.friends.pull(userName);

		// Save both users' updated data
		await Promise.all([user.save(), friend.save()]);

		res
			.status(200)
			.send({ status: true, message: "Friend removed successfully." });
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

// Check if a user is friend to other user
async function isFriend(req, res) {
	try {
		const { userName, friendUserName } = req.body;

		// Check if the user and friend are the same person
		if (userName === friendUserName) {
			return res.status(400).send({
				status: false,
				error: "User and Friend are the same.",
			});
		}

		// Find the user by userName
		const user = await User.findOne({ userName });

		// Check if user exists
		if (!user) {
			return res
				.status(404)
				.send({ status: false, error: "User does not exist." });
		}

		// Check if the friendUserName is in the user's friends list
		const isFriend = user.friends.includes(friendUserName);

		// Send the response with the friendship status
		return res.status(200).send({ status: true, isFriend });
	} catch (error) {
		// Handle any unexpected errors
		return res.status(500).send({ status: false, error: error.message });
	}
}

// Block a user for a user
async function blockUser(req, res) {
	try {
		const { userName, blockUserName } = req.body;

		// Check if the user and blockUser are the same person
		if (userName === blockUserName)
			return res
				.status(400)
				.send({ status: false, error: "User cannot block themselves." });

		// Find the user and the blockUser by userName
		const user = await User.findOne({ userName });
		if (!user)
			return res
				.status(404)
				.send({ status: false, error: "User does not exist." });

		const blockUser = await User.findOne({ userName: blockUserName });
		if (!blockUser)
			return res
				.status(404)
				.send({ status: false, error: "User to be blocked does not exist." });

		// Check if the user is already blocked
		if (user.blockedUsers.includes(blockUser._id)) {
			return res
				.status(400)
				.send({ status: false, error: "This user is already blocked." });
		}

		// Block the user
		user.blockedUsers.push(blockUser._id);

		// Save the updated user data
		await user.save();

		res
			.status(200)
			.send({ status: true, message: "User blocked successfully." });
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

// Unblock a user for a user
async function unblockUser(req, res) {
	try {
		const { userName, unblockUserName } = req.body;

		// Check if the user and unblockUser are the same person
		if (userName === unblockUserName)
			return res
				.status(400)
				.send({ status: false, error: "User cannot unblock themselves." });

		// Find the user and the unblockUser by userName
		const user = await User.findOne({ userName });
		if (!user)
			return res
				.status(404)
				.send({ status: false, error: "User does not exist." });

		const unblockUser = await User.findOne({ userName: unblockUserName });
		if (!unblockUser)
			return res
				.status(404)
				.send({ status: false, error: "User to be unblocked does not exist." });

		// Check if the user is already unblocked
		if (!user.blockedUsers.includes(unblockUser._id)) {
			return res.status(400).send({
				status: false,
				error: "This user is not in your blocked list.",
			});
		}

		// Unblock the user
		user.blockedUsers.pull(unblockUser._id);

		// Save the updated user data
		await user.save();

		res
			.status(200)
			.send({ status: true, message: "User unblocked successfully." });
	} catch (error) {
		res.status(500).send({ status: false, error: error.message });
	}
}

export {
	getProfile,
	signUp,
	signIn,
	signOut,
	updateLastSeen,
	getLastSeen,
	getAllFriends,
	addFriend,
	removeFriend,
	isFriend,
	blockUser,
	unblockUser,
	getUsers,
};

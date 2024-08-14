import FriendRequest from "../models/FriendRequest.schema.js";
import axios from "axios";
import services from "../../services.js";

// to send friend request to another user
async function sendFriendRequest(req, res) {
	try {
		const { userName, friendUserName } = req.body;

		// Prevent users from sending a friend request to themselves
		if (userName === friendUserName)
			throw new Error("Cannot send a request to yourself");

		// Check if a pending friend request already exists between these two users
		const existingFriendRequest = await FriendRequest.findOne({
			from: userName,
			to: friendUserName,
			status: "pending",
		});

		// If a pending request exists, inform the user
		if (existingFriendRequest) throw new Error("Friend request already sent");

		// Create a new friend request
		const newFriendRequest = new FriendRequest({
			from: userName,
			to: friendUserName,
		});

		// Save the new friend request to the database
		await newFriendRequest.save();

		// Send a success response indicating the request was successfully sent
		res.status(200).send({ status: true });
	} catch (error) {
		// Log the error message for debugging
		console.error("Error sending friend request:", error.message);

		// Send an error response with the appropriate status code and message
		res.status(400).send({ status: false, error: error.message });
	}
}

// accept friend request sent by another user
async function acceptFriendRequest(req, res) {
	try {
		const { friendRequestId } = req.body;

		// Find the friend request by its ID
		const existingFriendRequest = await FriendRequest.findById(friendRequestId);

		// Check if the friend request exists in the database
		if (!existingFriendRequest) throw new Error("Friend request doesn't exist");

		// Make an API call to the user service to add the user as a friend
		const response = await axios.post(
			`${services.user.target}/api/v1/user/add-friend`,
			{
				userName: existingFriendRequest.to,
				friendUserName: existingFriendRequest.from,
			},
		);

		console.log(response.data);

		// Check if the friend addition was successful in the user service
		if (!response.data.status) throw new Error(response.data.error);

		// Delete the friend request from the database after successful acceptance
		await existingFriendRequest.deleteOne();

		// Send a success response indicating the request was successfully accepted
		res.status(200).send({ status: true });
	} catch (error) {
		// Log the error message for debugging purposes
		console.error("Error accepting friend request:", error.message);

		// Send an error response with a 400 status code and the error message
		res.status(400).send({ status: false, error: error.message });
	}
}

// withdraw / cancel sent friend request
async function cancelFriendRequest(req, res) {
	try {
		const { friendRequestId } = req.body;

		// Find the friend request by its ID
		const existingFriendRequest = await FriendRequest.findById(friendRequestId);

		// Check if the friend request exists in the database
		if (!existingFriendRequest) throw new Error("Friend request doesn't exist");

		// Delete the friend request from the database
		await existingFriendRequest.deleteOne();

		// Send a success response indicating the request was successfully canceled
		res.status(200).send({ status: true });
	} catch (error) {
		// Log the error message for debugging purposes
		console.error("Error canceling friend request:", error.message);

		// Send an error response with a 400 status code and the error message
		res.status(400).send({ status: false, error: error.message });
	}
}

// reject friend request sent by another user
async function rejectFriendRequest(req, res) {
	try {
		const { friendRequestId } = req.body;

		// Find the friend request by ID
		const existingFriendRequest = await FriendRequest.findById(friendRequestId);

		// Check if the friend request exists
		if (!existingFriendRequest) throw new Error("Friend request doesn't exist");

		// Update the status of the friend request to "rejected"
		existingFriendRequest.status = "rejected";

		// Save the updated friend request
		await existingFriendRequest.save();

		// Send a success response after successfully updating the request
		res.status(200).send({ status: true });
	} catch (error) {
		// Log the error message for debugging
		console.error("Error rejecting friend request:", error.message);

		// Send an error response with the appropriate status code and message
		res.status(400).send({ status: false, error: error.message });
	}
}

// get all the friend requests sent by a user
async function getSentFriendRequests(req, res) {
	try {
		const { userName } = req.query;

		// Find all friend requests sent by the specified user
		const friendRequests = await FriendRequest.find({
			from: userName, // Use "from" to filter friend requests sent by the user
		}).select(["_id", "from", "to"]);

		// Send a success response with the list of friend requests
		res.status(200).send({ status: true, friendRequests });
	} catch (error) {
		// Log the error message for debugging
		console.error("Error retrieving sent friend requests:", error.message);

		// Send an error response with the appropriate status code and message
		res.status(400).send({ status: false, error: error.message });
	}
}

// get all the received friend request which is pending
async function getReceivedFriendRequests(req, res) {
	try {
		const { userName } = req.query;

		// Find all friend requests received by the specified user
		const friendRequests = await FriendRequest.find({
			to: userName, // Filter friend requests where the user is the recipient
			status: "pending",
		}).select(["_id", "from", "to"]); // Select only the necessary fields for the response

		// Send a success response with the list of friend requests
		res.status(200).send({ status: true, friendRequests });
	} catch (error) {
		// Log the error message for debugging
		console.error("Error retrieving received friend requests:", error.message);

		// Send an error response with the appropriate status code and message
		res.status(400).send({ status: false, error: error.message });
	}
}

export {
	sendFriendRequest,
	acceptFriendRequest,
	cancelFriendRequest,
	rejectFriendRequest,
	getSentFriendRequests,
	getReceivedFriendRequests,
};

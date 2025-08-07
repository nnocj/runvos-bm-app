const { connectToDB } = require('../data/database');
const { ObjectId } = require('mongodb');

// Get all users
async function getAllUsers(req, res) {
  const db = await connectToDB();
  const users = await db.collection('users').find().toArray();
  res.status(200).json(users);
}

// Get user by ID
async function getUserById(req, res) {
  const db = await connectToDB();
  const id = req.params.id;

  const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json(user);
};

// Create a new user
async function postUser(req, res) {
  const db = await connectToDB();
  const newUser = req.body;

  const result = await db.collection('users').insertOne(newUser);

  res.status(201).json(result);
};

// Update a user
async function putUser(req, res) {
  const db = await connectToDB();
  const id = req.params.id;
  const updatedData = req.body;

  const result = await db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'User updated successfully' });
};

// Delete a user
async function deleteUser(req, res) {
  const db = await connectToDB();
  const id = req.params.id;

  const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'User deleted successfully' });
};

module.exports = {
  getAllUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser
};

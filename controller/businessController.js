const { connectToDB } = require('../data/database');
const { ObjectId } = require('mongodb');

// Get all businesses
async function getAllBusinesses(req, res) {
  const db = await connectToDB();
  const businesses = await db.collection('businesses').find().toArray();
  res.status(200).json(businesses);
}

// Get a business by ID
async function getBusinessById(req, res) {
  const db = await connectToDB();
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const business = await db.collection('businesses').findOne({ _id: new ObjectId(id) });

  if (!business) {
    return res.status(404).json({ message: 'Business not found' });
  }

  res.status(200).json(business);
};

// Create a new business
async function postBusiness(req, res) {
  const db = await connectToDB();
  const business = req.body;

  const result = await db.collection('businesses').insertOne(business);
  res.status(201).json(result);
};

// Update an existing business
async function putBusiness(req, res) {
  const db = await connectToDB();
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const updatedBusiness = req.body;

  const result = await db.collection('businesses').replaceOne(
    { _id: new ObjectId(id) },
    updatedBusiness
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: 'Business not found' });
  }

  res.status(204).end();
};

// Delete a business
async function deleteBusiness(req, res) {
  const db = await connectToDB();
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  const result = await db.collection('businesses').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Business not found' });
  }

  res.status(204).end();
};

module.exports = {
  getAllBusinesses,
  getBusinessById,
  postBusiness,
  putBusiness,
  deleteBusiness,
};

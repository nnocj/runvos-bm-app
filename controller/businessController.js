const { ObjectId } = require('mongodb');
const { connectToDB } = require('../data/database');

// ===== Create Business =====
async function postBusiness(req, res) {
  try {
    const db = await connectToDB();
    const business = {
      userId: new ObjectId(req.user.id), // from JWT payload
      businessName: req.body.businessName,
      description: req.body.description,
      location: req.body.location,
      dateEstablished: new Date(req.body.dateEstablished),
      contact: req.body.contact
    };
    const result = await db.collection('businesses').insertOne(business);
    res.status(201).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Get All Businesses =====
async function getAllBusinesses(req, res) {
  try {
    const db = await connectToDB();
    const businesses = await db.collection('businesses').find().toArray();
    res.status(200).json(businesses);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Get All Businesses by User =====
async function getBusinessesByUserId(req, res) {
  const userId = req.params.userId || req.user?.id;
  if (!ObjectId.isValid(userId)) return res.status(400).json({ message: 'Invalid user ID format' });

  try {
    const db = await connectToDB();
    const businesses = await db.collection('businesses').find({ userId: new ObjectId(userId) }).toArray();
    res.status(200).json(businesses);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Get Business by ID =====
async function getBusinessById(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const db = await connectToDB();
    const business = await db.collection('businesses').findOne({ _id: new ObjectId(id) });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.status(200).json(business);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Update Business =====
async function putBusiness(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const db = await connectToDB();
    const updateData = { ...req.body };
    const result = await db.collection('businesses').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (!result.matchedCount) return res.status(404).json({ message: 'Business not found' });
    res.status(200).json({ message: 'Business updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Delete Business =====
async function deleteBusiness(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const db = await connectToDB();
    const result = await db.collection('businesses').deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return res.status(404).json({ message: 'Business not found' });
    res.status(204).end();
  } catch (err) { res.status(500).json({ error: err.message }); }
}

module.exports = { postBusiness, getAllBusinesses, getBusinessesByUserId, getBusinessById, putBusiness, deleteBusiness };

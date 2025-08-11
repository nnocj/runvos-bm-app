const { ObjectId } = require('mongodb');
const { connectToDB } = require('../data/database');

// ===== Create Service =====
async function postService(req, res) {
  try {
    const db = await connectToDB();
    const service = {
      businessId: new ObjectId(req.body.businessId),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration // e.g. "1 hour"
    };
    const result = await db.collection('services').insertOne(service);
    res.status(201).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Get Services by Business =====
async function getServicesByBusiness(req, res) {
  try {
    const db = await connectToDB();
    const services = await db.collection('services').find({
      businessId: new ObjectId(req.params.businessId)
    }).toArray();
    res.status(200).json(services);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Update Service =====
async function putService(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const db = await connectToDB();
    const updateData = { ...req.body };
    const result = await db.collection('services').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (!result.matchedCount) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json({ message: 'Service updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Delete Service =====
async function deleteService(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const db = await connectToDB();
    const result = await db.collection('services').deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return res.status(404).json({ message: 'Service not found' });
    res.status(204).end();
  } catch (err) { res.status(500).json({ error: err.message }); }
}

module.exports = { postService, getServicesByBusiness, putService, deleteService };

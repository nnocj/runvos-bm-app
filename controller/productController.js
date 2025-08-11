const { ObjectId } = require('mongodb');
const { connectToDB } = require('../data/database');

// ===== Create Product =====
async function postProduct(req, res) {
  try {
    const db = await connectToDB();
    const product = {
      businessId: new ObjectId(req.body.businessId),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock
    };
    const result = await db.collection('products').insertOne(product);
    res.status(201).json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Get Products by Business =====
async function getProductsByBusiness(req, res) {
  try {
    const db = await connectToDB();
    const products = await db.collection('products').find({
      businessId: new ObjectId(req.params.businessId)
    }).toArray();
    res.status(200).json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Update Product =====
async function putProduct(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid product ID format' });

  try {
    const db = await connectToDB();
    const updateData = { ...req.body };
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    if (!result.matchedCount) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
}

// ===== Delete Product =====
async function deleteProduct(req, res) {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid product ID format' });

  try {
    const db = await connectToDB();
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return res.status(404).json({ message: 'Product not found' });
    res.status(204).end();
  } catch (err) { res.status(500).json({ error: err.message }); }
}

module.exports = { postProduct, getProductsByBusiness, putProduct, deleteProduct };

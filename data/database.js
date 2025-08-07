const dotenv = require('dotenv');
dotenv.config();

const { MongoClient} = require('mongodb');

const uri = process.env.CONNECTION_STRING;

// Create the client ONCE
const client = new MongoClient(uri);

// Reuse the same DB instance
let db;

async function connectToDB() {
  if (!db) {
    await client.connect();
    db = client.db('cse341-w3-w4'); // Use the database name from your .env file
    console.log('Connected to the database');
  }
  return db;
}


module.exports = { connectToDB };
const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');

const uri = process.env.CONNECTION_STRING;
const client = new MongoClient(uri);

let db;

async function connectToDB() {
  if (!db) {
    await client.connect();
    db = client.db('cse341-w3-w4'); 
    console.log('Connected to the database');
  }
  return db;
}

module.exports = { connectToDB, client };//I'm exporting hte client so that jest can close it.

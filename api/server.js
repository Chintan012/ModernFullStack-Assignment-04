
const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.DB_URL || 'mongodb+srv://Chintan012:123@cluster0-1yltn.gcp.mongodb.net/test';
let db;

const resolvers = {
    Query: {
        about: () => aboutMessage,
        productList,
    },
    Mutation: {
        productAdd,
    }
};

async function productList() {
    const inventoryDB = await db.collection('products').find({}).toArray();
    return inventoryDB;
}

async function getNextSequence(name) {
    const result = await db.collection('counters').findOneAndUpdate(
      { _id: name },
      { $inc: { current: 1 } },
      { returnOriginal: false },
    );
    console.log(result)
  
    return result.value.current;
  }

async function productAdd(_, { product }) {
    const newProduct = product;
  console.log(newProduct)
  newProduct.id = await getNextSequence('products');
  console.log(newProduct.id)
  const result = await db.collection('products').insertOne(product);
  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
    console.log(savedProduct)
    return savedProduct;
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    },
});

async function connectToDb() {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
  }

const app = express();

app.use(express.static('public'));

server.applyMiddleware({ app, path: '/graphql' });

const port = process.env.API_SERVER_PORT || 3000;

(async () => {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API Server started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();
const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

        try {
              await client.connect();
              const database = client.db("TechTakeout");
              const productsCollection =  database.collection('products');
              const cartItems =  database.collection('cart-items');


// post api
app.post('/addservice', async(req,res) => {
  const service = req.body;
  console.log(service)
  const addProduct = await productsCollection.insertOne(service);
  res.json(addProduct);
})
// get api 
 app.get('/products', async (req,res) => {
    const cursor = productsCollection.find({});
    const products = await cursor.toArray();
    res.json(products);
  })

  // get single api
app.get('/products/:id',async(req,res) => {
  const id = req.params.id;
  const query = {_id:ObjectId(id)};
  const options = {
    projection: { _id: 0 },
  };
  const singleProduct = await productsCollection.findOne(query,options);
  res.send(singleProduct);
})

// post  api
app.post('/carts', async (req, res) => {
  const event = req.body;
  
  const options = {
    projection: { _id: 0 },
  };
  
  const result = await cartItems.insertOne(event);
  res.json(result);
})

// get personal cart item api
app.get('/carts/:email', async(req,res) => {

  const result = await cartItems.find({email:req.params.email}).toArray();
  // console.log({email:req.params.email});
  res.send(result);
})




// get api
app.get('/carts', async( req, res ) => {
  const cursor = cartItems.find({})
  const item = await cursor.toArray();
  res.json(item);
})



// delete single api 
app.delete('/carts/:id', async( req, res ) => {
  const id = req.params.id;
  const query = {_id:ObjectId(id)};
  const singlCart = await cartItems.deleteOne(query)
  res.send(singlCart);
})



}
        finally{
            // await client.close()
        }
}
run().catch(console.dir)




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`My server is running`)
})
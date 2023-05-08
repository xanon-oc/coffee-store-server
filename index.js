const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.MDATA_USER}:${process.env.MDATA_PASS}@cluster0.q0gulip.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client
      .db("coffeeStoreDB")
      .collection("coffeeData");

    app.get("/addCoffee", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/coffeeViewPage/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const coffee = await coffeeCollection.findOne(query);
      res.send(coffee);
    });

    app.get("/updateCoffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.put("/updateCoffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          photo: updatedCoffee.photo,
          price: updatedCoffee.price,
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    app.post("/addCoffee", async (req, res) => {
      const addCoffee = req.body;
      console.log(addCoffee);
      const result = await coffeeCollection.insertOne(addCoffee);
      res.send(result);
    });

    app.delete("/coffeeViewPage/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete", id);
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("COFFEE STORE SERVER IS RUNNING");
});

app.listen(port, () => {
  console.log(`Server is hitting on PORT : ${port}`);
});

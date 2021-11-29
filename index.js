const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7s4l5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("Tour_Details");
    const locationCollection = database.collection("location");
    const bookingsCollection = database.collection("bookings");
    // get api
    app.get("/location", async (req, res) => {
      const cursor = locationCollection.find({});
      const location = await cursor.toArray();
      res.send(location);
    });

    // single data

    app.get("/location/:id", async (req, res) => {
      const id = req?.params?.id;
      const query = { _id: ObjectId(id) };
      const location = await locationCollection.findOne(query);
      res.send(location);
    });

    // bookings
    app.post('/bookings', async (req, res) => {
      const book = req.body;
      const result = await bookingsCollection.insertOne(book);
      res.json(result);
  })

    
  } finally {
    //   await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello ");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

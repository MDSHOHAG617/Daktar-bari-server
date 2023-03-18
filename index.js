const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@daktarbari.abvhg0c.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
// client.connect((err) => {
//   // const collection = client.db("test").collection("devices");
//   const specialtyCollection = client.db("Daktar-bari").collection("specialty");

//   app.get("/specialty", async (req, res) => {
//     const query = {};
//     const cursor = specialtyCollection.find(query);
//     const specialty = await cursor.toArray();
//     res.send(specialty);
//   });
//   // perform actions on the collection object
//   client.close();
// });

async function run() {
  try {
    await client.connect();
    console.log("db connected");

    const specialtyCollection = client
      .db("Daktar-bari")
      .collection("specialty");
    app.get("/specialty", async (req, res) => {
      const query = {};
      const cursor = specialtyCollection.find(query);
      const specialty = await cursor.toArray();
      res.send(specialty);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from daktar bari server");
});

app.get("/users");

app.listen(port, () => {
  console.log(`Daktar-bari app listening on port ${port}`);
});

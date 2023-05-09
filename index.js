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
async function run() {
  try {
    await client.connect();
    console.log("db connected");

    const specialtyCollection = client
      .db("Daktar-bari")
      .collection("specialty");
    const userCollection = client.db("Daktar-bari").collection("users");
    const medicineCollection = client.db("Daktar-bari").collection("medicine");
    const orderCollection = client.db("Daktar-bari").collection("orders");

    app.get("/specialty", async (req, res) => {
      const query = {};
      const cursor = specialtyCollection.find(query);
      const specialty = await cursor.toArray();
      res.send(specialty);
    });
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      // const token = jwt.sign(
      //   { email: email },
      //   process.env.ACCESS_TOKEN_SECRET,
      //   { expiresIn: "1h" }
      // );
      // res.send({ result, token });
      res.send({ result });
    });
    app.get("/medicine", async (req, res) => {
      const query = {};
      const cursor = medicineCollection.find(query);
      const medicine = await cursor.toArray();
      res.send(medicine);
    });

    app.post(
      "/medicine",
      /*verifyJWT,*/ async (req, res) => {
        const newMedicine = req.body;
        const result = await medicineCollection.insertOne(newMedicine);
        res.send(result);
      }
    );
    // orders
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });

    app.get("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await orderCollection.findOne(query);
      res.send(order);
    });

    app.get("/order", async (req, res) => {
      const customerEmail = req.query.customerEmail;
      // const decodedEmail = req.decoded.email;
      // if (customerEmail === decodedEmail) {
      //   const query = { customerEmail: customerEmail };
      //   const bookedOrder = await orderCollection.find(query).toArray();
      //   return res.send(bookedOrder);
      // } else {
      //   return res.status(403).send({ message: "forbidden access" });
      // }
      // console.log("Auth Header", authorization);
      // const authorization = req.headers.authorization;

      const query = { customerEmail: customerEmail };
      const bookedOrder = await orderCollection.find(query).toArray();
      return res.send(bookedOrder);
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

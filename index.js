const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://money-calculate:qjNlBN6csYLxJYJg@cluster0.g0lqeq6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client.db("money-calculate").collection("users");

    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const updateOne = { upsert: true };
      const updatedDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        updateOne
      );
      console.log(user);
      res.send(result);
    });

    app.put("/addMoney/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const theUser = await usersCollection.findOne(filter);
      const addData = {
        amount: user.amount,
        date: user.date,
      };
      const updateOne = { upsert: true };
      const updatedDoc = {
        $set: {
          depositAmountDate: [...theUser.depositAmountDate, addData],
          paymentType: user.paymentType,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        updateOne
      );
      console.log(user);
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    app.get("/getUser/:id", async (req, res) => {
      const query = req.params.id;
      const filter = { _id: ObjectId(query) };
      const user = await usersCollection.findOne(filter);
      res.send(user);
    });

    app.get("/users", async (req, res) => {
      const query = {};
      const user = await usersCollection.find(query).toArray();
      res.send(user);
    });

    app.delete("/users/:id", async (req, res) => {
      const query = req.params.id;
      const filter = { _id: ObjectId(query) };
      const data = await usersCollection.deleteOne(filter);
      res.send(data);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running...on ${port}`);
});

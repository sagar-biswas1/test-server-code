const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());


const x=[
    {name:"sagar"},
    {name:'suchi'},
    {name:"eqra"}
]

const y=[]

// database
const uri = ''
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("make_club");
    const singerCollection = database.collection("singers");
    const addedSingerCollection = database.collection("addedSinger");

    // GET API
    app.get("/singers", async (req, res) => {
      const cursor = singerCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

 app.get("/data", async (req, res) => {
  res.send({x,y})
 });
    
 app.post("/addData", async (req, res) => {
   console.log(req.body)
   y.push(req.body)
   res.send(y)
 });

    // GET ANOTHER
    app.get("/addedMember", async (req, res) => {
      const cursor = addedSingerCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // GET SINGLE VALUE
    app.get("/addedMember/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await addedSingerCollection.findOne(query);
      // console.log(result);
      res.json(result);
    });
    // POST API
    app.post("/addedMember", async (req, res) => {
      const addedMember = req.body;
      const result = await addedSingerCollection.insertOne(addedMember);
      // console.log('post hit',result);
      // console.log('post hitting', req.body);
      if (result.acknowledged) {
        const cursor = addedSingerCollection.find({});
        const resResult = await cursor.toArray();
        res.json(resResult);
      } else {
        res.send("Message");
      }
      // res.send('result')
    });
    // DELETE API
    app.delete("/addedMember/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await addedSingerCollection.deleteOne(query);
      // console.log('deleted hit', result);
      res.json(result);
    });
    // UPDATE API
    app.put("/addedMember/:id", async (req, res) => {
      const id = req.params.id;
      const updateMember = req.body;
      const filter = { _id: id };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateMember.name,
          balance: updateMember.balance,
        },
      };
      const result = await addedSingerCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      // console.log(updateMember);
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Make islamic server running");
});

app.listen(port, () => {
  console.log("server running", port);
});

require('dotenv').config()
// const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
app.use(express.json());

// app.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.i1uhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    const patientCollection = client.db("Patient-data").collection("new-patient");

   app.post("/new-patient", async (req, res) =>{
     const newPatient = req.body; 
     const result = await patientCollection.insertOne(newPatient);
     res.send(result)
   })

   app.get('/all-patient', async (req, res) => {
    const result = await patientCollection.find().toArray();
      res.send(result)
   })

   app.delete('/all-patient/:id', async (req, res) =>{
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await patientCollection.deleteOne(query);
    res.send(result);
   })
   app.get('/all-patient/:id', async (req, res) =>{
    const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await patientCollection.findOne(query);
    res.send(result);
   })

   app.put('/patient-update/:id', async (req, res) =>{
    const id = req.params.id
    const updatedData = req.body;
    const query = {_id : new ObjectId(id)}
    const options = {upsert : true}
    const updated = {
      $set : updatedData
    }
    const result = await patientCollection.updateOne(query, updated, options)
    res.send(result)
  })
     
   


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hospital management system!');
})

app.listen(port, () => {
  console.log(`hospital management system! on port ${port}`)
})
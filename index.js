const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000
require("dotenv").config()

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hair and Hair Color Recommandation')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h3zxwhp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);


async function run() {

    try {
        const postUserData = client.db('hairCut').collection('postUserData')
        const usersCollection = client.db('hairCut').collection('usersCollection')
        const haircutservice = client.db('hairCut').collection('haircutservice')

        app.post('/post-user-data', async (req, res) => {
            const product = req.body
            const result = await postUserData.insertOne(product)
            res.send(result)
        })

        app.get('/get-user-data', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await postUserData.find(query).toArray()
            res.send(result)
        })



        app.post('/user', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.get('/user', async (req, res) => {
            const query = {}
            const cursor = usersCollection.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })

        app.get('/hair-service', async (req, res) => {
            const query = {}
            const cursor = haircutservice.find(query)
            const service = await cursor.toArray()
            res.send(service)
        })

        app.get("/user/:email", async (req, res) => {
            const email = req.params.email;
      
            const result = await usersCollection.findOne({ email });
      
            if (result?.email) {
              return res.send({ status: true, data: result });
            }
      
            res.send({ status: false });
          });
          app.get('/user/:id', async (req, res) => {
            const id = req.params.id

            const query = { role : new ObjectId(id) }

            const result = await usersCollection.findOne(query)
            res.send(result)
        })
        //   app.get('/user/:id', async (req, res) => {
        //     const role = req.params.role

        //     const query = { role : new ObjectId(role) }

        //     const result = await usersCollection.find(query)
        //     res.send(result)
        // })
    }

    finally {

    }

}

run()

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID

const passWord  = 'Gsgu6nRn31Up4ID5';

const uri = "mongodb+srv://dibaUser:Gsgu6nRn31Up4ID5@cluster0.0s4gz.mongodb.net/pronaydb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.get('/',(req, res) =>{
  res.sendFile(__dirname + '/index.html')
})


client.connect(err => {
  const collection = client.db("pronaydb").collection("products");

  app.get('/product',(req, res) =>{
   collection.find({})
   .toArray((err,documents)=>{
     res.send(documents)
   })
  })

  app.get('/product/:id',(req, res) =>{
    collection.find({_id : objectId(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0])
    })
  })

  app.post("/addProduct" ,(req, res) => {
     const product = req.body
     collection.insertOne(product)
     .then(result => {
       console.log("Data added")
       res.redirect('/')
     })
  })
  
   app.patch('/update/:id', (req, res) => {
     collection.updateOne({_id : objectId( req.params.id)},
     {
       $set :{price:req.body.price, quantity : req.body.quantity}
     })
     .then(result =>{
       res.send(result.modifiedCount>0)
     })
   })



  app.delete("/delete/:id",(req, res) => {
     collection.deleteOne({_id:objectId( req.params.id)})
     .then(result => {
      res.send(result.deletedCount>0)
     })
  })

  console.log("Database connection")
});


app.listen(3000)
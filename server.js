const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {MongoClient, ObjectId} = require('mongodb')

var db, collection;

const url = "mongodb+srv://tenzinc:tenzinc@burn-notice.ofi7dnh.mongodb.net/?retryWrites=true&w=majority";
const dbName = "burnnotice";
const port = 3000
app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + port + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('hatenotes').find().toArray((err, result) => {
    if (err) return console.log(err);

    const answeredNotes = result.filter(item => item.ansr);

    res.render('index.ejs', {
      answeredNotes: answeredNotes,
      hatenotes: result
    });
  });
});


app.post('/messages', (req, res) => {
  db.collection('hatenotes').insertOne({name: req.body.name, msg: req.body.question, ansr: ""}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages/answer', (req, res) => {
  
  const {id} = req.body
  db.collection('hatenotes').findOneAndUpdate(
    {  "id": ObjectId(id)},
    { $set: { ansr: ansr } },
    { returnOriginal: false },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result.value);
    }
  );
});


app.delete('/messages/answer', (req, res) => {
  const {id}= req.body
  db.collection('hatenotes').findOneAndDelete({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

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
    if (err) return console.log(err)
     res.render('index.ejs', {
      ansr : req.body.ansr,
      hatenotes: result
    })
  })
})

app.post('/messages', (req, res) => {
  db.collection('hatenotes').insertOne({name: req.body.name, msg: req.body.question, ansr: ''}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/messages/submit', (req, res) => {

  const answer = req.body.ansr;
  db.collection('hatenotes')
  .findOneAndUpdate({name: req.body.name, msg: req.body.question}, {
    $set: {
      ansr: answer
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })

})

app.delete('/messages', (req, res) => {
  db.collection('hatenotes').findOneAndDelete({name: req.body.name, msg: req.body.question}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})

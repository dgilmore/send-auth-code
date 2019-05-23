const mongoose = require("mongoose");
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const randomstring = require("randomstring");
const client = require("twilio")(env.TWILLIO_ACCOUNT_SID, env.TWILLIO_AUTH_TOKEN);
const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

//db

//connect our back end Code
mongoose.connect('mongodb+srv://dwg2:Vaarmy%212@send-auth-qrvmg.mongodb.net/', {dbName: 'send-auth'});

let db = mongoose.connection;
db.once("open", () => console.log("connected to db"));

//checks if db connection workers
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

//get method
router.get("/getData", (req,res) => {
  Data.find((err, data) => {
    if(err) return res.json({sucess: false, error:err});
    return res.json({sucess:true, data: data});
  });
});

router.get("/matchData", (req, res) => {
  const { id } = req.body;
  Data.findOne(id, err => {
    if(err) return res.send(err);
    return res.json({ success: true, data: data});
  });
});

router.post("/putData", (req,res) => {
  let data = new Data();
  const { id, message} = req.body;
  if((!id && id !== 0) || !message) {
    return res.json({
      sucess: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.code = randomstring.generate(7);

  res.header('Content-type', 'application/json');
  client.messages.create({
    from: env.TWILIO_PHONE_NUMBER,
    to: message,
    body: data.code
  }).then(() => {res.send(JSON.stringify({ sucess: true}));
  }).catch(err => {
    console.log(err);
    res.send(JSON.stringify({ sucess: false}));
  });
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use("/api", router);
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

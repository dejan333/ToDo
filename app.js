const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const colors = require('colors')
const router = require('./routes/crudRoutes')
const dotenv = require('dotenv').config()
const _ =require('lodash')

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs' )
app.use(express.static("public"));

//MongoDb Connection
try {
  mongoose.connect(`${process.env.DBCONNECT}`)
  console.log('Successfully connected to DB' .brightYellow);
}
 catch(error){
  console.error(error);
 }
 
 //Routes
 app.use(router);

 app.listen(process.env.PORT || 3000, console.log('Server running'.bold))
const express = require('express');
const app = express()
const port = process.env.port||5000;
const mongoose = require("mongoose");
const {mongoUrl} = require("./keys");
const cors = require("cors");
const {Jwt_secret}=require("./keys");


app.use(cors())
require('./models/model')

require('./models/post')

app.use(express.json())

app.use(require('./routes/auth'));

app.use(require('./routes/newPost'));

mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
    console.log("successfully connected to mongo")
})

mongoose.connection.on("error", () => {
    console.log("not connected to mongodb")
})


app.listen(port, () => {
    console.log("server is running on port" + " " + port)

})
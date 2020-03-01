const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(data => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.log(err);
})
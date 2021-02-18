"use strinct";

// imports
const mongoose = require("mongoose");
const app = require("./app.js");
const port = 3200;

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
mongoose
    .connect("mongodb://localhost:27017/employeecontrol", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("The server is loading...");
        app.listen(port, () => {
            console.log(`Server on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
    });
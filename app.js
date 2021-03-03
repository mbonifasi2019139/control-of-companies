"use strinct";

const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user-routes");
const companyRoutes = require("./routes/company-routes");
const employeeRoutes = require("./routes/employee-routes");

// An instance of Exress
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS declaration and settings
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// User routes
app.use("/api", userRoutes);

// Company routes
app.use("/api", companyRoutes);

// Employee routes
app.use("/api", employeeRoutes);

module.exports = app;
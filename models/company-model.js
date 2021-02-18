"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = Schema({
    username: String,
    password: String,
    companyName: String,
    address: String,
    phone: Number,
    employees: [{
        name: String,
        lastname: String,
        position: String,
        department: String,
    }, ],
});

module.exports = mongoose.model("company", companySchema);
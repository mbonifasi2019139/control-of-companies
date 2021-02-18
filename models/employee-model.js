"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let employeeSchema = Schema({
    name: String,
    lastname: String,
    position: String,
    department: String,
});

module.exports = mongoose.model("employee", employeeSchema);
"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = Schema({
    companyName: String,
    address: String,
    phone: Number,
    employees: [{ type: Schema.ObjectId, ref: "employee" }],
});

module.exports = mongoose.model("company", companySchema);
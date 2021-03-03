"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = Schema({
    username: String,
    password: String,
    role: { type: String, default: "ROL_EMPRESA" },
    companyId: { type: Schema.ObjectId, ref: "company" },
});

module.exports = mongoose.model("user", userSchema);
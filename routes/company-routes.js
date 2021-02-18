"use strict";

// imports
const express = require("express");
const companyController = require("../controllers/company-controller");

const api = express.Router();

// Companies
api.post("/saveCompany", companyController.saveCompany);
api.get("/getCompany/:id", companyController.getCompany);
api.get("/getCompanies", companyController.getCompanies);
api.put("/updateCompany/:id", companyController.updateCompany);
api.delete("/deleteCompany/:id", companyController.removeCompany);

module.exports = api;
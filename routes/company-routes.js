"use strict";

// imports
const express = require("express");
const companyController = require("../controllers/company-controller");
const mdAuth = require("../middlewares/authenticated");

const api = express.Router();

// Companies
api.post(
    "/setCompany/:idU", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],
    companyController.setCompany
);

api.get(
    "/getCompanies", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],
    companyController.getCompanies
);
api.put(
    "/:idU/updateCompany/:idC", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],
    companyController.updateCompany
);
api.delete(
    "/:idU/deleteCompany/:idC", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],
    companyController.removeCompany
);

module.exports = api;
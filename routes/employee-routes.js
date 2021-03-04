"use strict";

const express = require("express");
const employeeController = require("../controllers/employee-controller");
const mdAuth = require("../middlewares/authenticated");

const api = express();

// Employee
api.post(
    "/:idU/saveEmployee/:idC", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.saveEmployee
);

api.get(
    "/:idU/getEmployess/:idC", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.getEmployess
);

api.post(
    "/:idU/updateEmployee/:idC/:idE", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.updateEmployee
);

api.delete(
    "/:idU/removeEmployee/:idC/:idE", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.removeEmployee
);

api.post(
    "/:idU/searchEmployee/:idC", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.searchEmployee
);

// Create a PDF
api.post(
    "/createPDF/:idC", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.createEmployeesPDF
);

module.exports = api;
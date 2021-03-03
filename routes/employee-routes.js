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

api.post(
    "/:idU/updateEmployee/:idC/:idE", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.updateEmployee
);

api.delete(
    "/:idU/removeEmployee/:idC/:idE", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.removeEmployee
);

api.get(
    "/:idU/getEmployess/:idC", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.getEmployess
);
api.post(
    "/:idU/searchEmployee/:idC", [mdAuth.ensureAuth, mdAuth.ensureAuthCompany],
    employeeController.searchEmployee
);

module.exports = api;
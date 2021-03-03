"use strict";

const express = require("express");
const userController = require("../controllers/user-controller");
const mdAuth = require("../middlewares/authenticated");

const api = express.Router();

// User
api.post("/createUserAdmin", userController.createUserAdmin);
api.post("/login", userController.login);
api.post(
    "/registerUser", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],
    userController.registerUser
);
api.get(
    "/getUsers", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],
    userController.getUsers
);
api.delete(
    "/removeUser/:idU", [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin],
    userController.removeUser
);

module.exports = api;
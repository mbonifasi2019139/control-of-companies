"use strict";

const User = require("../models/user-model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

function createUserAdmin(req, res) {
    let user = User();
    const username = "admin";
    const password = "12345";
    const role = "ROL_ADMIN";

    User.findOne({ username: username.toLowerCase(), role: role },
        (err, userFound) => {
            if (err) {
                res.status(500).send({ message: "General error looking user admin" });
            } else if (userFound) {
                res.status(200).send({ message: "Admin already exists" });
            } else {
                bcrypt.hash(password, null, null, (err, passwordHashed) => {
                    if (err) {
                        res.status(500).send({ message: "General error" });
                    } else if (passwordHashed) {
                        user.username = username.toLowerCase();
                        user.password = passwordHashed;
                        user.role = role;

                        user.save((err, userSaved) => {
                            if (err) {
                                res
                                    .status(500)
                                    .send({ message: "General error saving user admin" });
                            } else if (userSaved) {
                                res.status(200).send({ message: "Admin saved" });
                            } else {
                                res.status(200).send({ message: "A problem has occurred" });
                            }
                        });
                    } else {
                        res.status(200).send({ message: "A problem has occurred" });
                    }
                });
            }
        }
    );
}

function login(req, res) {
    let login = req.body;

    if (login.username && login.password) {
        User.findOne({ username: login.username }, (err, usernameFound) => {
            if (err) {
                return res.status(500).send({ message: "General error" });
            } else if (usernameFound) {
                bcrypt.compare(
                    login.password,
                    usernameFound.password,
                    (err, passwordMatch) => {
                        if (err) {
                            return res.status(500).send({ message: "General error" });
                        } else if (passwordMatch) {
                            return res
                                .status(200)
                                .send({ token: jwt.createToken(usernameFound) });
                        } else {
                            return res
                                .status(404)
                                .send({ message: "A problem has occurred" });
                        }
                    }
                );
            } else {
                return res.status(500).send({ message: "Username not found" });
            }
        });
    } else {
        return res.status(200).send({ message: "Please, enter all data" });
    }
}

function registerUser(req, res) {
    let user = new User();
    let params = req.body;
    const role = "ROL_EMPRESA";

    if (params.username && params.password) {
        User.findOne({ username: params.username.toLowerCase() },
            (err, usernameFound) => {
                if (err) {
                    return res.status(500).send({ message: "General error" });
                } else if (usernameFound) {
                    return res
                        .status(401)
                        .send({ message: "Please, enter another username" });
                } else {
                    bcrypt.hash(params.password, null, null, (err, passwordHashed) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ message: "General error hashing password" });
                        } else if (passwordHashed) {
                            user.username = params.username.toLowerCase();
                            user.password = passwordHashed;
                            user.role = role;

                            user.save((err, userSaved) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ message: "General error saving a user" });
                                } else if (userSaved) {
                                    return res.send({ message: "User saved" });
                                } else {
                                    return res.status(400).send({ message: "User no saved" });
                                }
                            });
                        } else {
                            return res.status(400).send({ message: "Password no hashed" });
                        }
                    });
                }
            }
        );
    } else {
        return res
            .status(400)
            .send({ message: "Please enter username and password" });
    }
}

function getUsers(req, res) {
    User.find({}).exec((err, users) => {
        if (err) {
            return res.status(500).send({ message: "General error looking users" });
        } else if (users) {
            return res.send({ message: "Users found", users });
        } else {
            return res.status(400).send({ message: "No users" });
        }
    });
}

function removeUser(req, res) {
    let userId = req.params.idU;

    User.findByIdAndRemove(userId, (err, userRemoved) => {
        if (err) {
            return res.status(500).send({ message: "General error removing a user" });
        } else if (userRemoved) {
            return res.send({ message: "User removed" });
        } else {
            return res.status(404).send({ message: "User not found" });
        }
    });
}

module.exports = {
    createUserAdmin,
    login,
    registerUser,
    getUsers,
    removeUser,
};
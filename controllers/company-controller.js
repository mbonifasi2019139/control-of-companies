"use strict";

// imports
const bcrypt = require("bcrypt-nodejs");
const Company = require("../models/company-model");

// ------------------- Company CRUD ------------------
function saveCompany(req, res) {
    let company = new Company();
    let params = req.body;

    if (
        params.username &&
        params.password &&
        params.companyName &&
        params.address &&
        params.phone
    ) {
        Company.findOne({ username: params.username }, (err, companyFound) => {
            if (err) {
                res.status(500).send({ message: "General error" });
            } else if (companyFound) {
                res
                    .status(200)
                    .send({ message: "Username exists, please enter another username" });
            } else {
                bcrypt.hash(params.password, null, null, (err, passwordHashed) => {
                    if (err) {
                        res.status(500).send({ message: "General error" });
                    } else if (passwordHashed) {
                        company.username = params.username;
                        company.password = params.passwordHashed;
                        company.companyName = params.companyName;
                        company.address = params.address;
                        company.phone = params.phone;

                        company.save((err, companySaved) => {
                            if (err) {
                                res
                                    .status(500)
                                    .send({ message: "Error when trying to save company" });
                            } else if (companySaved) {
                                res.status(200).send({ message: "Company saved" });
                            }
                        });
                    }
                });
            }
        });
    } else {
        res.status(200).send({ message: "Plese, enter all data" });
    }
}

function getCompany(req, res) {
    let companyId = req.params.id;
    Company.findById(companyId).exec((err, company) => {
        if (err) {
            res.status(500).send({
                message: `General error when trying to find a company with id: ${companyId}`,
            });
        } else if (company) {
            res.status(200).send({ message: "Company found", company });
        } else {
            res.status(200).send({ meesage: "Company does not exists" });
        }
    });
}

function getCompanies(req, res) {
    Company.findOne({}, (err, companies) => {
        if (err) {
            res.status(500).send("General error");
        } else if (companies) {
            res
                .status(200)
                .send({ message: "Successfuly, companies found", companies });
        } else {
            res.status(200).send({ message: "There are not companies" });
        }
    });
}

function updateCompany(req, res) {
    let companyId = req.params.id;
    let update = req.body;

    if (update.username) {
        Company.findOne({ username: update.username }, (err, companyFound) => {
            if (err) {
                res.status(500).send({ message: "General error" });
            } else if (companyFound) {
                res.status(200).send({
                    message: "Company's username already exists, please enter another username",
                });
            } else {
                if (!update.password) {
                    Company.findByIdAndUpdate(
                        companyId,
                        update, { new: true },
                        (err, companyUpdated) => {
                            if (err) {
                                res
                                    .status(500)
                                    .send({ message: `Error trying to update a company` });
                            } else if (companyUpdated) {
                                res
                                    .status(200)
                                    .send({ message: "Company updated", companyUpdated });
                            } else {
                                res.status(200).send({ message: "Company does not exists" });
                            }
                        }
                    );
                } else {
                    res.status(200).send({ message: "Yo cannot chage the password" });
                }
            }
        });
    } else {
        if (!update.password) {
            Company.findByIdAndUpdate(
                companyId,
                update, { new: true },
                (err, companyUpdated) => {
                    if (err) {
                        res
                            .status(500)
                            .send({ message: `Error trying to update a company` });
                    } else if (companyUpdated) {
                        res
                            .status(200)
                            .send({ message: "Company updated", companyUpdated });
                    } else {
                        res.status(200).send({ message: "Company does not exists" });
                    }
                }
            );
        } else {
            res.status(200).send({ message: "Yo cannot chage the password" });
        }
    }
}

function removeCompany(req, res) {
    let companyId = req.params.id;
    Company.findByIdAndRemove(companyId, (err, companyRemoved) => {
        if (err) {
            res.status(500).send({ message: "Error trying to remove a company" });
        } else if (companyRemoved) {
            // jsonMessage(res, 500, "Company removed, I'm using a custom function :)");
            res.status(200).send({ message: "Company removed" });
        } else {
            res
                .status(200)
                .send({ message: "Company does not exists or is already removed" });
        }
    });
}
// A custom function to respond to the server
// let jsonMessage = (res, port, serverMessage) => {
//     return res.status(port).send({ meesage: serverMessage });
// };

// exports
module.exports = {
    saveCompany,
    getCompany,
    getCompanies,
    updateCompany,
    removeCompany,
};
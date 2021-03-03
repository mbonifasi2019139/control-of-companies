"use strict";

// imports
const bcrypt = require("bcrypt-nodejs");
const Company = require("../models/company-model");
const User = require("../models/user-model");

// ------------------- Company CRUD ------------------
/*
Cuando creamos una empresa tambien creamos su usuario.
Para poder crear una empresa necesitamos el id de su usuario 
*/
function setCompany(req, res) {
    let company = new Company();
    let userId = req.params.idU;
    let params = req.body;

    if (params.companyName && params.address && params.phone) {
        User.findById(userId, (err, userFound) => {
            if (err) {
                return res.status(500).send({ message: "General error" });
            } else if (userFound) {
                company.companyName = params.companyName;
                company.address = params.address;
                company.phone = params.phone;

                company.save((err, companySaved) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ message: "General error saving a company" });
                    } else if (companySaved) {
                        User.findByIdAndUpdate(
                            userId, { $push: { companyId: companySaved._id } }, { new: true },
                            (err, userUpdated) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ message: "General error updating user company" });
                                } else if (userUpdated) {
                                    return res.send({
                                        message: "User updated and company saved correctly",
                                    });
                                } else {
                                    return res.status(403).send({ message: "User not updated" });
                                }
                            }
                        );
                    } else {
                        return res.status(403).send({ message: "Company no saved" });
                    }
                });
            } else {
                return res.status(404).send({ message: "User not found" });
            }
        });
    } else {
        return res.status(400).send({ message: "Please, enter all data" });
    }
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
    let userId = req.params.idU;
    let companyId = req.params.idC;
    let update = req.body;

    if (userId) {
        User.findOne({ _id: userId, companyId: companyId }, (err, userFound) => {
            if (err) {
                return res.status(500).send({ message: "General error" });
            } else if (userFound) {
                Company.findByIdAndUpdate(
                    companyId,
                    update, { new: true },
                    (err, companyUpdated) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ message: "General error updating a company" });
                        } else if (companyUpdated) {
                            return res.send({ message: "Company updated" });
                        } else {
                            return res.status(404).send({ message: "Company not updated" });
                        }
                    }
                );
            } else {
                return res.status(404).send({ message: "User or company not found" });
            }
        });
    }
}

function removeCompany(req, res) {
    let userId = req.params.idU;
    let companyId = req.params.idC;

    User.findOneAndUpdate({ _id: userId, companyId: companyId }, { $pull: { companyId: companyId } }, { new: true },
        (err, userUpdated) => {
            if (err) {
                return res.status(500).send({ message: "General error" });
            } else if (userUpdated) {
                Company.findByIdAndRemove(companyId, (err, companyRemoved) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ message: "General error removing a company" });
                    } else if (companyRemoved) {
                        return res.send({ message: "Company removed" });
                    } else {
                        return res.status(403).send({ message: "Company no removed" });
                    }
                });
            } else {
                return res.status(404).send({ message: "User or company not found" });
            }
        }
    );
}

// exports
module.exports = {
    setCompany,
    // getCompany,
    getCompanies,
    updateCompany,
    removeCompany,
};
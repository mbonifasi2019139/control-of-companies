"use strict";

const User = require("../models/user-model");
const Employee = require("../models/employee-model");
const Company = require("../models/company-model");
const pdf = require("../services/pdf-document");

function saveEmployee(req, res) {
    let employee = Employee();
    // In the token
    let userTokenId = req.user.sub;
    // In the params
    let userId = req.params.idU;
    let companyId = req.params.idC;
    let params = req.body;

    if (userTokenId == userId && companyId) {
        User.findOne({ _id: userTokenId, companyId: companyId },
            (err, userFound) => {
                if (err) {
                    return res.status(500).send({ message: "General error" });
                } else if (userFound) {
                    employee.name = params.name;
                    employee.lastname = params.lastname;
                    employee.position = params.position;
                    employee.department = params.department;

                    employee.save((err, employeeSaved) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ message: "General error saving a employee" });
                        } else if (employeeSaved) {
                            Company.findByIdAndUpdate(
                                companyId, { $push: { employees: employeeSaved._id } }, { new: true },
                                (err, companyUpdated) => {
                                    if (err) {
                                        return res
                                            .status(500)
                                            .send({ message: "General error updating company" });
                                    } else if (companyUpdated) {
                                        return res.send({
                                            message: "Company updated and employee saved",
                                        });
                                    } else {
                                        return res
                                            .status(500)
                                            .send({ message: "Company not updated" });
                                    }
                                }
                            );
                        } else {
                            return res.status(500).send({ message: "Employee not saved" });
                        }
                    });
                } else {
                    return res
                        .status(404)
                        .send({ message: "User or company does not match" });
                }
            }
        );
    } else {
        return res
            .status(403)
            .send({ message: "Please, enter companyId or userId does not match" });
    }
}

function getEmployess(req, res) {
    // In the token
    let userTokenId = req.user.sub;

    // In the params
    let userId = req.params.idU;
    let companyId = req.params.idC;

    if (userTokenId != userId) {
        return res.status(500).send({ message: "You do not have permissions" });
    } else {
        User.findOne({ _id: userTokenId, companyId: companyId },
            (err, companyFound) => {
                if (err) {
                    return res.status(500).send({ message: "General error" });
                } else if (companyFound) {
                    Company.findOne({ _id: companyId }, (err, companyFound) => {
                        if (err) {
                            return res.status(500).send({ message: "Genera error" });
                        } else if (companyFound) {
                            Employee.countDocuments({ _id: companyFound.employees },
                                (err, employeesFound) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Genera error" });
                                    } else if (employeesFound) {
                                        return res.send({
                                            message: "Employees found",
                                            employeesFound,
                                            employees: companyFound.employees,
                                        });
                                    } else {
                                        return res
                                            .status(403)
                                            .send({ message: "There are not employees" });
                                    }
                                }
                            );
                        } else {
                            return res.status(403).send({ message: "An error has ocurred" });
                        }
                    }).populate("employees");
                } else {
                    return res.status(404).send({ message: "User-company not found" });
                }
            }
        );
    }
}

function updateEmployee(req, res) {
    //In the token
    let userTokenId = req.user.sub;
    //In the params
    let userId = req.params.idU;
    let companyId = req.params.idC;
    let update = req.body;
    let employeeId = req.params.idE;

    if (userTokenId != userId) {
        return res.status(500).send({ message: "You do not have permissions" });
    } else {
        User.findOne({ _id: userTokenId, companyId: companyId },
            (err, userFound) => {
                if (err) {
                    return res.status(500).send({ message: "General error" });
                } else if (userFound) {
                    Company.findOne({ _id: companyId, employees: employeeId },
                        (err, employeeFound) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ message: "General error searching a employee" });
                            } else if (employeeFound) {
                                Employee.findByIdAndUpdate(
                                    employeeId,
                                    update, { new: true },
                                    (err, employeeUpdated) => {
                                        if (err) {
                                            return res
                                                .status(500)
                                                .send({ message: "General error updating a employee" });
                                        } else if (employeeUpdated) {
                                            return res.send({
                                                message: "Employee updated successfully",
                                            });
                                        } else {
                                            return res
                                                .status(403)
                                                .send({ message: "Employee not updated" });
                                        }
                                    }
                                );
                            } else {
                                return res
                                    .status(404)
                                    .send({ message: "Employee does not exists" });
                            }
                        }
                    );
                } else {
                    return res
                        .status(404)
                        .send({ message: "User-comapany does not exists" });
                }
            }
        );
    }
}

function removeEmployee(req, res) {
    //In the token
    let userTokenId = req.user.sub;

    //In the params
    let userID = req.params.idU;
    let companyId = req.params.idC;
    let employeeId = req.params.idE;

    if (userTokenId !== userID) {
        return res.status(500).send({ message: "You do not have permissions" });
    } else {
        User.findOne({ _id: userTokenId, companyId: companyId },
            (err, companyFound) => {
                if (err) {
                    return res.status(500).send({ message: "General error" });
                } else if (companyFound) {
                    Company.findByIdAndUpdate(
                        companyId, { $pull: { employees: employeeId } },
                        (err, employeeCUpdated) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ message: "Generar error searching a employee" });
                            } else if (employeeCUpdated) {
                                Employee.findByIdAndRemove(
                                    employeeId,
                                    (err, employeeRemoved) => {
                                        if (err) {
                                            return res
                                                .status(500)
                                                .send({ message: "Generar error removing a employee" });
                                        } else if (employeeRemoved) {
                                            return res.send({ message: "Employee removed" });
                                        } else {
                                            return res
                                                .status(404)
                                                .send({ message: "Employee not removed" });
                                        }
                                    }
                                );
                            } else {
                                return res
                                    .status(404)
                                    .send({ message: "Company-employee does not exists" });
                            }
                        }
                    );
                } else {
                    return res
                        .status(404)
                        .send({ message: "User-company does not exists" });
                }
            }
        );
    }
}

function searchEmployee(req, res) {
    // In the token
    let userTokenId = req.user.sub;

    // In the params
    let userId = req.params.idU;
    let companyId = req.params.idC;
    let params = req.body;

    if (userTokenId == userId && companyId) {
        User.findOne({ _id: userTokenId, companyId }, (err, userFound) => {
            if (err) {
                return res.status(500).send({ message: "General error" });
            } else if (userFound) {
                Company.findById(companyId, (err, companyFound) => {
                    if (err) {
                        return res.status(500).send({ message: "General error" });
                    } else if (companyFound) {
                        Employee.find({
                                $and: [{ _id: companyFound.employees }],
                                $or: [
                                    { _id: params.idEmployee },
                                    { name: params.name },
                                    { lastname: params.lastname },
                                    { position: params.position },
                                    { department: params.department },
                                ],
                            },
                            (err, employeesFound) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ message: "General error searching employees" });
                                } else if (employeesFound) {
                                    return res.send({
                                        message: "Employees found",
                                        employeesFound,
                                    });
                                } else {
                                    return res
                                        .status(404)
                                        .send({ message: "Employees not found" });
                                }
                            }
                        );
                    } else {
                        return res.status(404).send({ message: "Company no match" });
                    }
                }).populate();
            } else {
                return res.status(404).send({ message: "User-company not found" });
            }
        });
    } else {
        return res
            .status(403)
            .send({ message: "Enter companyId or userId no match" });
    }
}

// Create a file
function createEmployeesPDF(req, res) {
    let companyId = req.params.idC;
    let userTokenId = req.user.sub;

    if (companyId) {
        User.findOne({ _id: userTokenId, companyId }, (err, userFound) => {
            if (err) {
                return res.status(500).send({ message: "General error" });
            } else if (userFound) {
                Company.findById(companyId, (err, companyFound) => {
                    if (err) {
                        return res.status(500).send({ message: "General error" });
                    } else if (companyFound) {
                        pdf
                            .pdfEmployees({
                                company: companyFound.companyName,
                                employees: companyFound.employees,
                            })
                            .then((msg) => {
                                return res.send({ msg });
                            })
                            .catch((err) => {
                                return res.status(500).send({
                                    err,
                                });
                            });
                    } else {
                        return res.status(404).send({
                            message: "Company not found",
                        });
                    }
                }).populate("employees");
            } else {
                return res.status(404).send({ message: "User-company not match" });
            }
        });
    } else {
        return res.status(403).send({ message: "Please, enter companyId" });
    }
}

module.exports = {
    saveEmployee,
    updateEmployee,
    removeEmployee,
    getEmployess,
    searchEmployee,
    createEmployeesPDF,
};
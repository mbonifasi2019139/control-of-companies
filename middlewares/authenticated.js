"use strict";

const jwt = require("jwt-simple");
const moment = require("moment");

const secretKey = "encriptacion-IN6AM@";

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({ message: "There is not a header authentication" });
    } else {
        var token = req.headers.authorization.replace(/['"']+/g, "");

        try {
            var payload = jwt.decode(token, secretKey);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({ message: "Expired token" });
            }
        } catch (error) {
            return res.status(401).send({ message: "Token invalid" });
        }

        req.user = payload;
        next();
    }
};

exports.ensureAuthAdmin = (req, res, next) => {
    if (req.user.role != "ROL_ADMIN") {
        return res.status(404).send({ message: "You do not have permission" });
    } else {
        next();
    }
};

exports.ensureAuthCompany = (req, res, next) => {
    if (req.user.role !== "ROL_EMPRESA") {
        return res.status(404).send({ message: "You do not have permission" });
    } else {
        next();
    }
};
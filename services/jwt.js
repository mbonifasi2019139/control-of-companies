"use strict";

const jwt = require("jwt-simple");
const moment = require("moment");

const secretKey = "encriptacion-IN6AM@";

exports.createToken = (user) => {
    let payload = {
        sub: user._id,
        role: user.role,
        iat: moment().unix,
        exp: moment().add(2, "hours").unix(),
    };
    return jwt.encode(payload, secretKey);
};
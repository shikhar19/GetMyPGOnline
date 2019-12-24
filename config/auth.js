const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

module.exports.adminAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.secret);
    req.user = decodedPayload;
    if (req.user.data.role === "admin") {
      return next();
    } else {
      return res.status(401).json({ message: "Access denied!" });
    }
  }
};

module.exports.ownerAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.secret);
    req.user = decodedPayload;
    if (req.user.data.role === "owner") {
      return next();
    } else {
      return res.status(401).json({ message: "Access denied!" });
    }
  }
};

module.exports.tenantAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.secret);
    req.user = decodedPayload;
    if (req.user.data.role === "tenant") {
      return next();
    } else {
      return res.status(401).json({ message: "Access denied!" });
    }
  }
};

module.exports.allAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.secret);
    req.user = decodedPayload;
    return next();
  }
};

module.exports.restrictedAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.secret);
    req.user = decodedPayload;
    if (req.user.data.role === "admin") {
      return next();
    } else if (
      (req.user.data.role === "owner" && req.params.id === req.user.data._id) ||
      (req.user.data.role === "tenant" && req.params.id === req.user.data._id)
    ) {
      return next();
    } else {
      return res.status(401).json({ message: "Access denied!" });
    }
  }
};

module.exports.someAuth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    let user = await User.findById(req.params.id);
    if (user) {
      if (user.email === req.params.email) return next();
    } else {
      return res.status(400).json({ message: "No Such User!" });
    }
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.secret);
    req.user = decodedPayload;
    if (req.user.data.role === "admin") {
      return next();
    } else if (
      (req.user.data.role === "owner" && req.params.id === req.user.data._id) ||
      (req.user.data.role === "tenant" && req.params.id === req.user.data._id)
    ) {
      return next();
    } else {
      return res.status(401).json({ message: "Access denied!" });
    }
  }
};

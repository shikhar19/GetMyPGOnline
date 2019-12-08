const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DeletedUsers = require("../models/DeletedUsers");
const nodemailer = require("nodemailer");
require("dotenv").config();

sendVerificationLink = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    if (user.isVerified === true) {
      return res.status(400).json({ message: "Already Verified!" });
    } else {
      const salt = (await bcrypt.genSalt(10)) + Date.now();
      token = await bcrypt.hash(email, salt);
      user.verifyEmail.token = token;
      user.verifyEmail.expiresIn = Date.now() + 3600000;
      await user.save();
      const message = `Confirmation Link: <a href = 'http://localhost:8000/api/users/verifyEmail/${email}/${token}'>Confirm Here</a><br><strong>Note:</strong> Do not reply to this email.<br><br>Thanks,<br>Team <strong>Find PG Online</strong>`;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let mailOptions = {
        from: `FIND PG ONLINE <${process.env.email}>`,
        to: email,
        subject: "Please Verify your E-mail Address",
        html: message
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return 0;
        }
        console.log("Message sent: %s", info.messageId);
      });
    }
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

module.exports.register = async (req, res) => {
  let { name, email, contact, password, role } = req.body;
  if (!name || !email || !contact || !password || !role) {
    return res.status(400).json({ message: "All fields are mandatory!" });
  }
  let emailRegex = /^\S+@\S+\.\S+/,
    phoneRegex = /(^[6-9]{1}[0-9]{9}$)/,
    passwordRegex = /^[\S]{8,}/;
  if (emailRegex.test(email)) {
    if (passwordRegex.test(String(password))) {
      if (phoneRegex.test(Number(contact))) {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ message: "User already registered!" });
        } else {
          let newUser = {
            name,
            email,
            password,
            role,
            contact
          };
          if (await DeletedUsers.findOne({ email: email })) {
            res.status(400).json({ message: "Your EmailId is Banned!" });
          }
          const salt = await bcrypt.genSalt(10);
          newUser.password = await bcrypt.hash(newUser.password, salt);
          user = await User.create(newUser);
          temp = 1;
          try {
            await sendVerificationLink(newUser.email);
          } catch (err) {
            temp = 0;
            console.log(err);
          }
          if (temp === 0) {
            return res.status(400).json({
              success: false,
              message: "Registeration Successful!",
              error: "Verification Email cannot be sent. Login to recieve!"
            });
          } else {
            res.status(200).json({
              success: true,
              message: "Registeration Successful! Verify Your Email Address!"
            });
          }
        }
      } else {
        return res.status(400).json({ message: "Contact number not valid!" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters long!" });
    }
  } else {
    return res.status(400).json({ message: "EmailID is not valid!" });
  }
};

module.exports.login = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Wrong Credentials." });
  } else if (isMatch && user.isVerified == false) {
    if (user.verifyEmail.expiresIn >= Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID!" });
    } else {
      await sendVerificationLink(user.email);
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID!" });
    }
  } else {
    const token = jwt.sign(
      {
        type: "user",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          role: user.role
        }
      },
      process.env.secret,
      {
        expiresIn: 604800 // for 1 week time in milliseconds
      }
    );
    return res
      .header("x-auth-token", token)
      .status(200)
      .json({ success: true, token: token });
  }
};

module.exports.verifyEmail = async (req, res) => {
  let { email, token } = req.params;
  debugger;
  let user = await User.findOne({ email: email });
  if (user) {
    if (user.isVerified === true) {
      const token = jwt.sign(
        {
          type: "user",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({ success: true, message: "Already Verified", token: token });
    } else if (
      (user.verifyEmail.expiresIn >= Date.now()) &
      (user.verifyEmail.token === token)
    ) {
      user.isVerified = true;
      user.verifyEmail.token = undefined;
      user.verifyEmail.expiresIn = undefined;
      await user.save();
      const token = jwt.sign(
        {
          type: "user",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            contact: user.contact,
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({ success: true, message: "Email Verified", token: token });
    }
  } else {
    res.status(400).json({ message: "Invalid Request or Link Expired" });
  }
};

module.exports.profile = async (req, res) => {
  let user = await User.findById(req.user.data._id);
  id = user._id;
  isVerified = user.isVerified;
  name = user.name;
  email = user.email;
  password = user.password; //removed before publishing
  contact = user.contact;
  role = user.role;
  return res.status(200).json({
    _id: id,
    isVerified: isVerified,
    name: name,
    email: email,
    password: password,
    contact: contact,
    role: role
  });
};

module.exports.updateUser = async (req, res) => {
  let user = await User.findById({ _id: req.user.data._id });
  let { name, password, confirmPassword } = req.body;
  passwordRegex = /^[\S]{8,}/;
  if (passwordRegex.test(String(password))) {
    if (password != confirmPassword) {
      res
        .status(400)
        .json({ message: "Password and Confirm Password doesn't Match!" });
    } else if (
      user.name === name &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.status(400).json({ message: "Entries Are Same Already!" });
    } else {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      await User.updateOne(
        { _id: req.user.data._id },
        { $set: { name: name, password: password } }
      );
      res.status(200).json({ message: "Updated Successfully!" });
    }
  }
};

module.exports.deleteUser = async (req, res) => {
  let user = await User.findById(req.params.id);
  if (user) {
    if (user.role == "admin") {
      res.status(400).json({ message: "Cannot Delete User!" });
    } else {
      let newEmail = {
        email
      };
      if (await DeletedUsers.findOne({ email: email })) {
        res.status(400).json({ message: "Already Deleted!" });
      } else {
        deletedUser = await DeletedUsers.create(newEmail);
      }
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Deleted Successfully!" });
    }
  } else {
    res.status(400).json({ message: "No such User!" });
  }
};

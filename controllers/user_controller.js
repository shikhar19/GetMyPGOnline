const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DeletedUsers = require("../models/DeletedUsers");
const RequestBanRemovalUsers = require("../models/RequestBanRemovalUsers");
const nodemailer = require("nodemailer");
const SendOtp = require("sendotp");
const messageTemplate =
  "Your One Time Password is: {{otp}}. This Code is valid only for 10 Minutes. Do not give this code to anyone, even if they say they are from GetMyPGOnline! \n\nIf you didn't request this code, simply ignore this message. Thank You!\n\nThanks,\nTeam Get My PG Online";
const sendOtp = new SendOtp(process.env.MSG91_API_KEY, messageTemplate);

require("dotenv").config();

sendVerificationLink = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    if (user.isEmailVerified === true) {
      return res.status(400).json({ message: "Already Verified!" });
    } else {
      let token = Date.now() + user._id + Math.random(10000000000);
      user.verifyEmail.token = token;
      user.verifyEmail.expiresIn = Date.now() + 3600000;
      await user.save();
      const message = `<center style="min-width:580px;width:100%">
      <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Almost done, <strong style="color:#24292e!important">${user.name}</strong>! To complete your <strong>Get-My-PG-Online</strong> sign up, we just need to verify your email address: <strong style="color:#24292e!important">${email}</strong>.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}'>Verify Your Email Address</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
      <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}</p>
      <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">If it's not you registering with us then follow this link: https://getmypgonline.herokuapp.com/api/users/delete/${user._id}/${email}</p>
      <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You’re receiving this email because you recently created a new Get-My-PG-Online account or added a new email address. If this wasn’t you, please ignore this email.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
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
        from: `GET MY PG ONLINE <${process.env.email}>`,
        to: email,
        subject: "Please Verify your E-mail Address",
        html: message,
        attachments: [
          {
            filename: "GetMyPG-Online.JPG",
            path: __dirname + "/assets/GetMyPG-Online.JPG",
            cid: "unique"
          }
        ]
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

mailToBannedUsers = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">You are Banned <strong style="color:#24292e!important">${user.name}</strong>! To talk to our admin at <strong>Get-My-PG-Online</strong> and to request them to remove the ban from your email address: <strong style="color:#24292e!important">${email}</strong> then click the button below.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/requestremoveban/${email}'>Contact Us</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You are banned from using all of Get-My-PG-Online's features. This may be due to someone creating fake ID using your Email or you don't want to continue using our services!</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/requestremoveban/${email}. You’re receiving this email because your email ID was registered with us and you have been banned.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
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
      from: `GET MY PG ONLINE <${process.env.email}>`,
      to: email,
      subject: "You are Banned from our Services!",
      html: message,
      attachments: [
        {
          filename: "GetMyPG-Online.JPG",
          path: __dirname + "/assets/GetMyPG-Online.JPG",
          cid: "unique"
        }
      ]
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return 0;
      }
      console.log("Message sent: %s", info.messageId);
    });
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

sendRemoveBanOnRequest = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    let token = Date.now() + user._id + Math.random(10000000000);
    user.verifyEmail.token = token;
    user.verifyEmail.expiresIn = Date.now() + 3600000;
    await user.save();
    const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Hey <strong style="color:#24292e!important">${user.name}</strong>! Your Ban is removed <strong>Get-My-PG-Online</strong> and we are sending this email to verify your email address: <strong style="color:#24292e!important">${email}</strong>. Click the button below to verify yourself.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}'>Verify Your Email Address</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}. You’re receiving this email because you requested us to remove your ban and we have processed your request.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
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
      from: `GET MY PG ONLINE <${process.env.email}>`,
      to: email,
      subject: "Your Request has been processed & Your Ban is Removed!",
      html: message,
      attachments: [
        {
          filename: "GetMyPG-Online.JPG",
          path: __dirname + "/assets/GetMyPG-Online.JPG",
          cid: "unique"
        }
      ]
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return 0;
      }
      console.log("Message sent: %s", info.messageId);
    });
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

sendRemoveBanByAdmin = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    let token = Date.now() + user._id + Math.random(10000000000);
    user.verifyEmail.token = token;
    user.verifyEmail.expiresIn = Date.now() + 3600000;
    await user.save();
    const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Hey <strong style="color:#24292e!important">${user.name}</strong>! Your Ban is removed <strong>Get-My-PG-Online</strong> and we are sending this email to verify your email address: <strong style="color:#24292e!important">${email}</strong>. Click the button below to verify yourself.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}'>Verify Your Email Address</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com/api/users/verifyEmail/${email}/${token}. You’re receiving this email because we have removed your ban and you can use our services.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
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
      from: `GET MY PG ONLINE <${process.env.email}>`,
      to: email,
      subject: "Your Ban is Removed!",
      html: message,
      attachments: [
        {
          filename: "GetMyPG-Online.JPG",
          path: __dirname + "/assets/GetMyPG-Online.JPG",
          cid: "unique"
        }
      ]
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return 0;
      }
      console.log("Message sent: %s", info.messageId);
    });
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

sendRemoveBanOnRequestVerified = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Hey <strong style="color:#24292e!important">${user.name}</strong>! Your Ban is removed <strong>Get-My-PG-Online</strong> and you can continue to use your email address: <strong style="color:#24292e!important">${email}</strong> to use our services. Click the button below to open our platform.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com'>GetMyPG Online</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com. You’re receiving this email because you requested us to remove your ban and we have processed your request.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
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
      from: `GET MY PG ONLINE <${process.env.email}>`,
      to: email,
      subject: "Your Request has been processed & Your Ban is Removed!",
      html: message,
      attachments: [
        {
          filename: "GetMyPG-Online.JPG",
          path: __dirname + "/assets/GetMyPG-Online.JPG",
          cid: "unique"
        }
      ]
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return 0;
      }
      console.log("Message sent: %s", info.messageId);
    });
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

sendRemoveBanByAdminVerified = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:500px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Hey <strong style="color:#24292e!important">${user.name}</strong>! Your Ban is removed <strong>Get-My-PG-Online</strong> and you can continue to use your email address: <strong style="color:#24292e!important">${email}</strong> to use our services. Click the button below to open our platform.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://getmypgonline.herokuapp.com'>GetMyPG Online</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You can start using all of Get-My-PG-Online's features to explore, book your PG, and all of this at just one click.</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://getmypgonline.herokuapp.com. You’re receiving this email because we have removed your ban and you can use our services.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Get My PG Online</strong></div>`;
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
      from: `GET MY PG ONLINE <${process.env.email}>`,
      to: email,
      subject: "Your Ban is Removed!",
      html: message,
      attachments: [
        {
          filename: "GetMyPG-Online.JPG",
          path: __dirname + "/assets/GetMyPG-Online.JPG",
          cid: "unique"
        }
      ]
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return 0;
      }
      console.log("Message sent: %s", info.messageId);
    });
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
    // phoneRegex = /(^[6-9]{1}[0-9]{9}$)/,
    passwordRegex = /^[\S]{8,}/;
  if (emailRegex.test(email)) {
    if (passwordRegex.test(String(password))) {
      // if (phoneRegex.test(Number(contact))) {
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
          return res.status(400).json({ message: "Your EmailId is Banned!" });
        }
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        user = await User.create(newUser);
        (temp = 1), (temp1 = 1);
        try {
          await sendVerificationLink(newUser.email);
        } catch (err) {
          temp = 0;
          console.log(err);
        }
        try {
          await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
            if (data.type === "error") temp1 = 0;
            else {
              user.otpExpiresIn = Date.now() + 600000;
              user.save();
              sendOtp.setOtpExpiry("10"); //in minutes
            }
          });
        } catch (err) {
          console.log(err);
        }
        if (temp === 0) {
          return res.status(400).json({
            success: false,
            message: "Registeration Successful!",
            error: "Verification Email cannot be sent. Login to recieve!"
          });
        } else if (temp1 === 0) {
          return res.status(400).json({
            success: false,
            message: "Registeration Successful!",
            error: "OTP cannot be sent. Login to recieve!"
          });
        } else if (temp === 0 && temp1 === 0) {
          return res.status(400).json({
            success: false,
            message: "Registeration Successful!",
            error: "Verification Email & OTP cannot be sent. Login to recieve!"
          });
        } else {
          res.status(200).json({
            success: true,
            message:
              "Registeration Successful! Verify Your Email Address & Mobile Number!"
          });
        }
      }
      // } else {
      //   return res.status(400).json({ message: "Contact number not valid!" });
      // }
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
  debugger;
  let { emailormobile, password } = req.body;
  let user =
    (await User.findOne({ email: emailormobile })) ||
    (await User.findOne({ contact: emailormobile }));
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Wrong Credentials!" });
  } else if (
    isMatch &&
    user.isEmailVerified === false &&
    user.isContactVerified === false
  ) {
    if (
      user.verifyEmail.expiresIn >= Date.now() &&
      user.otpExpiresIn >= Date.now()
    ) {
      return res.status(401).json({
        success: false,
        message: "Verify your EmailID & your Mobile Number!"
      });
    } else if (user.verifyEmail.expiresIn < Date.now()) {
      await sendVerificationLink(user.email);
      return res.status(401).json({
        success: false,
        message: "Verify your EmailID Now!"
      });
    } else if (user.otpExpiresIn < Date.now()) {
      await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
        user.otpExpiresIn = Date.now() + 600000;
        user.save();
        sendOtp.setOtpExpiry("10"); //in minutes
      });
      return res.status(401).json({
        success: false,
        message: "Verify your Mobile No. Now!"
      });
    } else {
      await sendVerificationLink(user.email);
      await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
        user.otpExpiresIn = Date.now() + 600000;
        user.save();
        sendOtp.setOtpExpiry("10"); //in minutes
      });
      return res.status(401).json({
        success: false,
        message: "Verify your EmailID & your Mobile Number now!"
      });
    }
  } else if (isMatch && user.isContactVerified === false) {
    if (user.otpExpiresIn >= Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Verify your Mobile No.!" });
    } else {
      await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
        user.otpExpiresIn = Date.now() + 600000;
        user.save();
        sendOtp.setOtpExpiry("10"); //in minutes
      });
      return res
        .status(401)
        .json({ success: false, message: "Verify your Mobile No. now!" });
    }
  } else if (isMatch && user.isEmailVerified === false) {
    if (user.verifyEmail.expiresIn >= Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID!" });
    } else {
      await sendVerificationLink(user.email);
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID now!" });
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
  let user = await User.findOne({ email: email });
  if (user) {
    if (user.isEmailVerified === true && user.isContactVerified === true) {
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
        .json({ success: true, message: "Already Verified" });
    } else if (
      user.isEmailVerified === true &&
      user.isContactVerified === false
    ) {
      if (user.otpExpiresIn >= Date.now())
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your Mobile No."
        });
      else {
        await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
          user.otpExpiresIn = Date.now() + 600000;
          user.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        });
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your Mobile No. Now"
        });
      }
    } else if (
      user.verifyEmail.expiresIn >= Date.now() &&
      user.verifyEmail.token === token &&
      user.isContactVerified === true
    ) {
      user.isEmailVerified = true;
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
        .json({
          success: true,
          message: "Email Verified! You can login now!",
          token: token
        });
    } else if (
      user.verifyEmail.expiresIn >= Date.now() &&
      user.verifyEmail.token === token &&
      user.isContactVerified === false
    ) {
      user.isEmailVerified = true;
      user.verifyEmail.token = undefined;
      user.verifyEmail.expiresIn = undefined;
      await user.save();
      if (user.otpExpiresIn >= Date.now()) {
        res.status(200).json({
          success: true,
          message: "Email Verified! Verify your Mobile no.!"
        });
      } else {
        await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
          user.otpExpiresIn = Date.now() + 600000;
          user.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        });
        res.status(200).json({
          success: true,
          message: "Email Verified! Verify your Mobile no. now!"
        });
      }
    } else {
      await sendVerificationLink(user.email);
      res.status(400).json({ message: "Invalid Request or Link Expired!" });
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.verifyContact = async (req, res) => {
  debugger;
  let { contact } = req.params;
  let { otp } = req.body;
  let user = await User.findOne({ contact: contact });
  if (user) {
    if (user.isContactVerified === true) {
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
        .json({ success: true, message: "Already Verified" });
    } else {
      await sendOtp.verify(contact, otp, async (error, data) => {
        console.log(data);
        if (data.type == "success") {
          if (user.otpExpiresIn >= Date.now()) {
            user.isContactVerified = true;
            user.otpExpiresIn = undefined;
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
              .json({
                success: true,
                message: "Contact Verified",
                token: token
              });
          }
        }
        if (data.type == "error") {
          await sendOtp.send(user.contact, "GetMyPGOnline", (err, data) => {
            user.otpExpiresIn = Date.now() + 600000;
            user.save();
            sendOtp.setOtpExpiry("10"); //in minutes
          });
          res.status(400).json({ message: "Invalid Request or Link Expired!" });
        }
      });
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.profile = async (req, res) => {
  let user = await User.findById(req.user.data._id);
  id = user._id;
  isEmailVerified = user.isEmailVerified;
  name = user.name;
  email = user.email;
  contact = user.contact;
  role = user.role;
  return res.status(200).json({
    _id: id,
    isEmailVerified: isEmailVerified,
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
      deletedUser = await DeletedUsers.create({
        _id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        isEmailVerified: user.isEmailVerified,
        isContactVerified: user.isContactVerified,
        contact: user.contact,
        role: user.role
      });
      deletedUser.save();
      await mailToBannedUsers(deletedUser.email);
      await User.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: "Deleted Successfully!" });
    }
  } else {
    if (await DeletedUsers.findOne({ deletedID: req.params.id })) {
      res.status(400).json({ message: "Already Deleted!" });
    } else {
      res.status(400).json({ message: "No such User!" });
    }
  }
};

module.exports.removeUserBan = async (req, res) => {
  debugger;
  let user = await DeletedUsers.findById(req.params.id);
  let requestedUser = await RequestBanRemovalUsers.findById(req.params.id);
  if (user) {
    userAdded = await User.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      isEmailVerified: user.isEmailVerified,
      contact: user.contact,
      role: user.role
    });
    if (
      userAdded.isEmailVerified === false &&
      userAdded.isContactVerified === false
    ) {
      await sendOtp.send(userAdded.contact, "GetMyPGOnline", (err, data) => {
        if (data.type === "error") temp1 = 0;
        else {
          userAdded.otpExpiresIn = Date.now() + 600000;
          userAdded.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        }
      });
      if (requestedUser) await sendRemoveBanOnRequest(userAdded.email);
      else await sendRemoveBanByAdmin(userAdded.email);
    } else if (userAdded.isContactVerified === false) {
      await sendOtp.send(userAdded.contact, "GetMyPGOnline", (err, data) => {
        if (data.type === "error") temp1 = 0;
        else {
          userAdded.otpExpiresIn = Date.now() + 600000;
          userAdded.save();
          sendOtp.setOtpExpiry("10"); //in minutes
        }
      });
      if (requestedUser) await sendRemoveBanOnRequestVerified(userAdded.email);
      else await sendRemoveBanByAdminVerified(userAdded.email);
    } else if (userAdded.isEmailVerified === false) {
      if (requestedUser) await sendRemoveBanOnRequest(userAdded.email);
      else await sendRemoveBanByAdmin(userAdded.email);
    } else {
      if (requestedUser) await sendRemoveBanOnRequestVerified(userAdded.email);
      else await sendRemoveBanByAdminVerified(userAdded.email);
    }
    await DeletedUsers.deleteOne({ _id: req.params.id });
    if (requestedUser)
      await RequestBanRemovalUsers.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Ban Removed Successfully!" });
  } else {
    res.status(400).json({ message: "No such User!" });
  }
};

module.exports.requestRemoveBan = async (req, res) => {
  let user = await DeletedUsers.findOne({ email: req.params.email });
  let requestedUser = await RequestBanRemovalUsers.findOne({
    email: req.params.email
  });
  let { reason } = req.body;
  if (user && !requestedUser) {
    userAdded = await RequestBanRemovalUsers.create({
      _id: user.id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      role: user.role,
      reason: reason
    });
    res.status(200).json({ message: "Requested Successfully!" });
  } else if (requestedUser) {
    res.status(200).json({ message: "Your Request is Already in Process!" });
  } else {
    res.status(400).json({ message: "You can't request!" });
  }
};

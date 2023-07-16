const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require('otp-generator');
const nodeMailer = require('nodemailer')

const { User } = require('../Model/userModel');
const { Otp } = require('../Model/otpModel');


module.exports.signUp = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if (user) return res.status(400).send("User already registered!");
    const OTP = otpGenerator.generate(6, {
        digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
    });
    const email = req.body.email;
    const password = req.body.password
    const html = `<h1>OTP Confirmation<h1>
                <p>your OTP is: ${OTP}<p>`
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'jainvishesh004@gmail.com',
            pass: 'yxfrtyqoknegrsuj'
        }
    });

    const info = await transporter.sendMail({
        from: 'jainvishesh004@gmail.com',
        to: email,
        subject: 'testing',
        html: html
    });

    console.log(info)
    const otp = new Otp({ email: email, otp: OTP, password: '' });
    const salt = await bcrypt.genSalt(10)
    otp.password = await bcrypt.hash(password, salt)
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send("Otp send successfully!");
}
module.exports.loginUser = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) return res.status(400).send("User not registered!");
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Wrong Password!");

    const OTP = otpGenerator.generate(6, {
        digits: true, upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
    });
    const email = req.body.email;
    const password = req.body.password
    const html = `<h1>OTP Confirmation<h1>
                <p>your OTP is: ${OTP}<p>`
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'jainvishesh004@gmail.com',
            pass: 'yxfrtyqoknegrsuj'
        }
    });

    const info = await transporter.sendMail({
        from: 'jainvishesh004@gmail.com',
        to: email,
        subject: 'testing',
        html: html
    });

    console.log(info)
    const otp = new Otp({ email: email, otp: OTP, password: '' });
    const salt = await bcrypt.genSalt(10)
    //otp.password = await bcrypt.hash(password, salt)
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    //return res.status(200).send("Otp send successfully!");

    return res.status(200).send({
        message: "OTP Sent to registered mail",
        data: {}
    });
}

module.exports.verifyOtpLogin = async (req, res) => {
    const otpHolder = await Otp.find({
        email: req.body.email
    });

    console.log(otpHolder)
    if (otpHolder.length === 0) return res.status(400).send("You use an Expired OTP!");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    //const rightPassword = rightOtpFind.password;
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (validUser) {
        const OTPDelete = await Otp.deleteMany({
            email: rightOtpFind.email
        });
        return res.status(200).send({
            message: "User LoggedIn Successfull!",
            data: result
        });
    } else {
        return res.status(400).send("Your OTP was wrong!")
    }
}



module.exports.verifyOtp = async (req, res) => {
    const otpHolder = await Otp.find({
        email: req.body.email
    });

    console.log(otpHolder)
    if (otpHolder.length === 0) return res.status(400).send("You use an Expired OTP!");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const rightPassword = rightOtpFind.password;
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.email === req.body.email && validUser) {
        const user = new User(_.pick(req.body, ["email"]));
        user.password = rightPassword;

        const result = await user.save();
        const OTPDelete = await Otp.deleteMany({
            email: rightOtpFind.email
        });
        return res.status(200).send({
            message: "User Registration Successfull!",
            data: result
        });
    } else {
        return res.status(400).send("Your OTP was wrong!")
    }
}
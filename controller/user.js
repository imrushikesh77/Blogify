const User = require("../models/user");

const getSignIn = (req, res) => {
    return res.render("signin");
}
const getSignUp = (req, res) => {
    return res.render("signup");
}
const postSignUp = async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password,
    })
    return res.redirect("/");

}
const postSignIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        console.log("token", token);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin",{
            error:"Incorrect Email or Password",
        })
    }
}

const getLogout = (req,res) => {
    res.clearCookie("token").redirect("/");
}

module.exports = { getSignIn, getSignUp, postSignUp, postSignIn, getLogout}
require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blogs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/auth");
const User = require("./models/user");
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
        .then(()=>{
            console.log("Database connected");
        })

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req,res)=>{
    console.log(req.user);
    const user = await User.findById(req.user);
    const allBlogs = await Blog.find({});
    res.render("home",{
        user, 
        blogs: allBlogs,
    });
})
app.use("/user",userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, ()=>{
    console.log(`Server started at ${PORT}`);
})
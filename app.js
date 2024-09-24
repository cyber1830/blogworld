require("dotenv").config();
const express = require("express");
const path = require("path");
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const blog = require("./models/blog");
const { checkforAuthCookie } = require("./middlewares/authentication");
const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then((e) => console.log("db connected"));
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkforAuthCookie("token"));
app.use(express.static(path.resolve('./public')));
app.get("/", async (req, res) => {
    const allBlogs = await blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  });

app.use('/user', userRoute);
app.use('/blog', blogRoute);
app.listen(PORT, () => console.log(`server started at PORT: ${PORT}`));
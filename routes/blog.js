const express = require("express")
const multer = require("multer");
const Blog = require("../models/blogs");
const path = require("path");
const router = express.Router();
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName)
    }
  })
  
  const upload = multer({ storage: storage })

router.get("/add-new",(req,res)=>{
    res.render("addBlogs",{
        user: req.user,
    })
})
router.post("/",upload.single("coverImage"), async(req,res)=>{
    const {title,body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`,
    })
    return res.redirect(`/blog/${blog._id}`);
})

router.get("/:id", async(req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
    res.render("blog",{
        blog,
        user: req.user,
        comments,   
    })
})

router.post("/comment/:blogId", async(req,res)=>{
    const { content } = req.body;

    if (!content) {
        return res.status(400).send("Comment content is required.");
    }

    try {
        const comment = await Comment.create({
            content: content,
            createdBy: req.user._id, // Assuming req.user is correctly populated
            blogId: req.params.blogId,
        });

        return res.redirect(`/blog/${req.params.blogId}`);
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).send("Error creating comment");
    }
})

module.exports = router;
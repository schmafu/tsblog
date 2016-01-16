import * as express from "express";
import * as db from "../db";
var router = express.Router();

router.get("/",(req,res) => {
    db.getBlogs((blogs) => {res.json(blogs);});
});

router.get("/:id",(req,res) => {
    db.getBlog(req.params.id,(blog) => {res.json(blog);});
});

export = router;
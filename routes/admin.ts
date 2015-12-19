import * as express from "express";
import * as db from "../db";

var router = express.Router();

// router.use(() => {authentificationstuff; next();});
router.post('/blog/create',(req,res) => {
    db.insertBlog(req.body.title,req.body.content,(blog) => {
        res.send({success:(blog != null)});
    });
});

export = router;
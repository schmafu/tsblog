import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";

import * as db from "./db";
import * as adminroute from "./routes/admin";
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/admin",adminroute)
app.get("/blog",(req,res) => {
    db.getBlogs((blogs) => {res.json(blogs);});
});

app.get("/blog/:id",(req,res) => {
    console.log("im get:" + req.params.id);
    db.getBlog(req.params.id,(blog) => {res.json(blog);});
});



app.get("/about", (req,res) => {
    res.json({"content":"some about text"});
});



app.listen(3000, () => {
    console.log("running...");
});




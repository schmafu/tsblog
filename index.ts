import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import * as db from "./db";
import * as adminRoute from "./routes/admin";
import * as authRoute from "./routes/auth";
import * as blogRoute from "./routes/blog";

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("jwtSecret",crypto.randomBytes(30).toString("base64"));

app.use("/admin",adminRoute)
app.use("/blog",blogRoute);

app.use("/auth", authRoute);


app.get("/about", (req,res) => {
    res.json({"content":"some about text"});
});

app.listen(3000, () => {   
});




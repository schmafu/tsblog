import * as express from "express";
import * as db from "../db";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

var router = express.Router();

router.post("/", (req,res) => {
    if(req.body.username && req.body.password && req.body.username.length > 3) {
        db.getUser(req.body.username,(user) => {
            console.log(`password: ${req.body.password} hash: ${user.password}`);
           if(!user) {
                res.send(404,{message: "user not found"});
            } else if(bcrypt.compareSync(req.body.password,user.password)) {
                var token = jwt.sign(user.password, req.app.get("jwtSecret"),{expiresInMinutes:60});
                res.send({message:"access granted", token: token}); 
            } else {
                res.send(403,{message: "invalid password"});
            }       
        });
    } else {
        res.send(400, {message: "invalid request"});
    } 
});

export = router;
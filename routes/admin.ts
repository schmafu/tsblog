import * as express from "express";
import * as db from "../db";
import * as jwt from "jsonwebtoken";

var router = express.Router();

router.use((req,res,next) => {
     
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, req.app.get("jwtSecret"), (err,decoded) => {      
        if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
            // if everything is good, save to request for use in other routes
            req["decoded"] = decoded;    
            next();
        }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
});

router.get('/',(req,res) => {
    res.json({message:"adminarea"});
})  

router.post('/blog/create',(req,res) => {
    db.insertBlog(req.body.title,req.body.content,(blog) => {
        res.send({success:(blog != null)});
    });
});

/* i am the only one
router.post('/user/create',(req,res) => {
    db.saveUser(req.body.username,req.body.password,(hash) => {
        res.send({success: hash});
    });
});
*/

router.patch('/blog/:id/update', (req,res) => {
    var delta:{title?:string,content?:string} = {};
    if(!!req.body.title)
      delta.title = req.body.title;
    if(!!req.body.content)
        delta.content = req.body.content;
    
    db.updateBlog(req.params.id,delta,(blog) => {
        res.send({success:(blog != null)});
    })
});
export = router;
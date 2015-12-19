import mongodb = require('mongodb');
import bcrypt = require('bcrypt');


var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true})
var db = new mongodb.Db('tsblog', server, { w: 1 });
db.open(function() {});

export interface Blog {
    _id: mongodb.ObjectID;
    title: string;
    content: string;
}
export interface User {
    _id: mongodb.ObjectID;
    username: string;
    password: string;
    admin: boolean;
}

export function getBlogs(callback:(blog:Blog[])=>void, limit=10) {
    db.collection('blog', (err,collection) => {
        if(err) {
            console.log(err);
            return;
        }
        collection.find({}).sort({_id:-1}).limit(limit).toArray((err2,results) => {
            if(err2) {
                console.log("cursor error:" + err2);
                return;
            }
            callback(results);
        });
    });
}

export function getBlog(id:string,callback:(blog:Blog) => void) {
    db.collection('blog',(err,collection) => {
        if(err) {
            console.log(err);
            return;
        }
        console.log(id);
        collection.findOne({_id:mongodb.ObjectID.createFromHexString(id)},(err2,result:Blog) => {
            if(err2) {
                console.log("cursor error: " + err2);
                return;
            }
            callback(result);               
        });
    });
}

export function insertBlog(title:string,content:string,callback:(blog:Blog)=> void) {
    db.collection('blog',(err,collection) => {
        if(err) {
            console.log(err);
            return;
        }
        collection.insertOne({title:title,content:content}, (err2,result) => {
           if(err2)
             callback(null);
           callback(result); 
            
        });
    });
}

export function updateBlog(id:string, delta:{title?:string, content?:string}, callback:(blog:Blog) => void) {
    db.collection('blog',(err,collection) => {
        if(err) {
            console.log(err);
            return;
        }
        collection.updateOne({_id:mongodb.ObjectID.createFromHexString(id)},
            {$set:delta},(err2,result) => {
            if(err2) {
                console.log(err2)
                callback(null);
            }
            callback(result);
        });        
    })
}

export function saveUser(username:string,password:string, callback:(hash:string) => void) {
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(password,salt,(err,hash) => {
            db.collection('user', (err, collection) => {
                if(err) {
                    callback(null);
                    return;
                }
                collection.insertOne({username:username, password:hash, admin:false},(err,result) => {
                    if(err) {
                        callback(null);
                    }
                    callback(hash);
                });
                
            });
        });
    });
}
export function isAdmin(username:string, hash:string, callback:(admin:boolean) => void) {
    db.collection('user', (err, collection) => {
        if(err) {
           callback(false);
           return;
        }
        collection.findOne({username:username, password:hash},(err,result:User) => {
        if(err) {
           callback(false);
           return;
        }
        callback(result.admin);
    });                
  });
}
export function getUser(username:string, callback:(user:User) => void) {
    db.collection('user', (err, collection) => {
        if(err) {
           callback(null);
           return;
        }
        collection.findOne({username:username},(err,result:User) => {
        if(err) {
           callback(null);
           return;
        }
        callback(result);
    });                
  });
}
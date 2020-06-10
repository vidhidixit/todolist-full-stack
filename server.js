var express=require('express');
var cors =require('cors');
var mongo =require('mongodb');
var bodyParser= require('body-parser');
var idcount=0;
var app=express();
app.use(cors());
app.use(bodyParser.json());
var uniuser="";
var url="mongodb://127.0.0.1:27017";
mongo.MongoClient.connect(url,(err,client)=>{

    if(err){
        console.log("not connected");
        return;
    }
    console.log("connected");
    var mydb=client.db("mydb");
    app.get('/login',(req,res)=>{
        console.log(req.query);
        var username=req.query.username;
        
        var password=req.query.password;
        console.log(username);
        console.log(password);
   mydb.collection("login").find({"username": username,"password": password}).toArray().then(result=>{
       res.status(200);
       console.log(result);
       if(result.length===0)
       res.send({"access":"false"});
       else
       {
        uniuser=username;
       res.send({ "access": "true"});
       
       }
   })
   .catch(error=>{
    res.status(401).send({"access":"false"});
   });
      
    });
    app.get('/register',(req,res)=>{
        var username=req.query.username;
        mydb.collection("login").find({"username": username}).toArray().then(result=>{
            if(result.length===0)
            res.send({"access":"true"});
            else
            res.send({"access":"false"});
        })
    });
    app.get('/todo/name',(req,res)=>{
        res.send({"uniuser": uniuser});
    });
    app.get('/todo/list',(req,res)=>{
        if(uniuser===undefined){
            res.status(401).send();
            return;
        }
        var filterObject={
            username: uniuser
        };
        console.log(filterObject);
        mydb.collection("todolist").find(filterObject).toArray().then(result=>{ res.status(200).send(result);})
        .catch(error=>{
            console.log(error);
            res.status(500).send();
        })
    });
    app.get('/todo/complete',(req,res)=>{
        console.log(req.query);
        mydb.collection("todolist").update({"_id": parseInt(req.query.id)},{$set: { "iscompleted": "true"}}); 
        mydb.collection("todolist").find({ "username": uniuser}).toArray().then(result=>{ res.status(200).send(result);})
        .catch(error=>{
            console.log(error);
            res.status(500).send();
        });
    });
    app.get('/todo/filter',(req,res)=>{
        if(req.query.username===undefined){
            res.status(400);
           res.send();
            return;
        }
        var  filterObject={
            username: req.query.username
        };
        if(req.query.completed!=undefined){
            if(req.query.completed==='true')
            filterObject.iscompleted=true;
            else
            filterObject.iscompleted=false;
        }
        console.log(filterObject);
        mydb.collection('todolist').find(filterObject).toArray().then(result=>{
            res.status(200).send(result);
        })
        .catch(error=>{
            console.log(error);
            res.status(500).send();
        })
    })
    app.get('/todo/delete',(req,res)=>{
        var delobj={
            _id: parseInt(req.query.id)
        };
        console.log(parseInt(req.query.id));
        console.log(delobj);
        mydb.collection('todolist').deleteOne(delobj);
        mydb.collection('todolist').find({ "username": uniuser}).toArray().then(result=>{
           // console.log(result);
            res.status(200).send(result);
        });
        
    });
    app.get('/todo/create',(req,res)=>{
        var insertObject={
            username: req.query.username,
            title: req.query.title,
            description: req.query.description,
            deadline: req.query.deadline,
            iscompleted: req.query.completed,
            _id: idcount
        }
        console.log(insertObject);
        idcount+=1;
        mydb.collection('todolist').insertOne(insertObject).then(
        mydb.collection('todolist').find({ "username": insertObject.username}).toArray().then(result=>{
            console.log(result);
            res.status(200).send(result);
        })
        )
        
    })
    app.get('/todo/logout',(req,res)=>{
        uniuser="";
    })
    app.listen(8080);
});
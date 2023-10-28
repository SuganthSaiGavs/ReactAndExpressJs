//import expressjs
const express = require('express');
var bodyParser=require('body-parser');
bodyParser=bodyParser.urlencoded({extended:false});
//Initialize express.js
var app=express();


var visitorCount=0;
var users=[{userID:"100",firstName:"Sanjay",lastName:"Srivatsa"},
            {userID:"101",firstName:"Suganth",lastName:"Sai"},
            {userID:"102",firstName:"Sangee",lastName:"Rajan"}];


function home(request,response){
    var resp="<html><body><b>Welcome to our site...<br>";
    resp+="<a href=/welcome>Welcome page</a></body></html>"
    response.send(resp);
}

function welcome(req,res){
    var today=new Date();
    visitorCount++;
    var resp="<html><body><b>Today:"+today;
    resp += "</b><br><b>Visitor count </b> :"+visitorCount;
    resp+="</body></html>";
    res.send("Welcome to express Js<br/>"+resp);
}

function getUser(req,res){
    var status=false;
    var userid=req.query.uid;
    var firstName=req.query.fname;
    for(var user of users){
        if(userid==user.userID&&firstName==user.firstName){
            status=true;
            break;
        }
    }
    if(status)
        res.send(user);
    else
        res.send("<b> No employee with ID </b>",userid);
}

function getAllUser(req,res){
        res.send(users);
}

function getById(req,res){

}

function deleteById(req, res) {
    var userid = req.query.uid;
    var indexToRemove = -1;

    for (var i = 0; i < users.length; i++) {
        if (userid == users[i].userID) {
            indexToRemove = i;
            break;
        }
    }
    if (indexToRemove !== -1) {
        users.splice(indexToRemove, 1); // Remove the user from the users array
        res.send("User with ID " + userid + " has been removed.");
    } else {
        res.send("<b>No employee with ID </b>" + userid);
    }
}

function addNewUser(request,response){
    var user_id=request.body.uid;
    var first_Name=request.body.fname;
    var last_Name=request.body.lname;
    var rval=users.push({userID:user_id, firstName:first_Name, lastName:last_Name});
    response.send("user added.Total users:"+rval);
}

function updateuser(request, response) {
    var userid = request.body.uid;
    var updatedUser = {
        userID: userid,
        firstname: request.body.fname,
        lastname: request.body.lname,
    };
    var userIndex = -1;
    for (var i = 0; i < users.length; i++) {
        if (userid == users[i].userID) {
            userIndex = i;
            break;
        }
    }
    if (userIndex !== -1) {
        // Update the user at the specified index
        users[userIndex] = updatedUser;
        response.send("User updated successfully.");
    } else {
        response.send("User not found for update.");
    }
}
app.get('/welcome',welcome);
app.get('/',home);
app.get("/getUser",getUser) 
app.get("/getAlluser",getAllUser);
app.get('getById',getById);
app.get('/deleteById',deleteById);
app.post('/addUser',bodyParser,addNewUser);
app.put("/updateuser",bodyParser,updateuser);


function feedback(){
    console.log("Server Started on port 8800..");
    console.log("Open the browser and visit http://localhost:8800/welcome");
}
app.listen(8800,feedback);
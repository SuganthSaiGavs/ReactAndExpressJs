var mysql = require('mysql');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to the database
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'world',
    user: 'root',
    password: 'root'
});

mysqlConnection.connect(function(err) {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log("Connected to the database...");
});

function displayAllUsers(request, response) {
    mysqlConnection.query('SELECT * FROM users', function(error, results) {
        if (error) {
            console.error("Error fetching users:", error);
            response.status(500).send("Internal Server Error");
            return;
        }
        response.send(results);
    });
}

function getuserbyId(request, response) {
    var userid = request.query.uid;
    mysqlConnection.query('SELECT * FROM users WHERE userid = ?', [userid], function(error, results) {
        if (error) {
            console.error("Error fetching user by ID:", error);
            response.status(500).send("Internal Server Error");
            return;
        }
        response.send(results);
    });
}

function getuserbyName(request, response) {
    var useremail = request.query.email;
    mysqlConnection.query('SELECT * FROM users WHERE email = ?', [useremail], function(error, results) {
        if (error) {
            console.error("Error fetching user by email:", error);
            response.status(500).send("Internal Server Error");
            return;
        }
        response.send(results);
    });
}

function createUser(request, response) {
    var userid = request.body.uid;
    var pwd = request.body.password;
    var email = request.body.email;

    mysqlConnection.query('INSERT INTO users VALUES(?,?,?)', [userid, pwd, email], function(error) {
        if (error) {
            console.error("Error inserting user:", error);
            response.status(500).send("Internal Server Error");
            return;
        }
        response.send("Insert successful");
    });
}

function deleteUser(request, response) {
    var userid = request.params.uid;

    mysqlConnection.query('DELETE FROM users WHERE userid = ?', [userid], (error, results) => {
        if (error) {
            console.error("Error deleting the user:", error);
            response.status(500).send("Internal Server Error");
            return;
        }

        if (results.affectedRows === 0) {
            response.status(404).send("User not found");
            return;
        }
        response.send("User deleted successfully");
    });
}

function updateUser(request, response) {
    var userid = request.body.uid;
    var password = request.body.password;
    var email = request.body.email;

    if (!userid || !password || !email) {
        return response.status(400).send("Required data missing");
    }

    mysqlConnection.query('UPDATE users SET password = ?, email = ? WHERE userid = ?', [password, email, userid], function(error, results) {
        if (error) {
            console.error("Error updating the user:", error);
            response.status(500).send("Internal Server Error");
            return;
        }

        if (results.affectedRows === 0) {
            response.status(404).send("User not found");
            return;
        }
        response.send("User updated successfully");
    });
}


//This one for angular project
function loginUser(request, response) {
    const { userid, password } = request.body;

    const trimmedUserid = userid.trim();
const trimmedPassword = password.trim();
    if (!trimmedUserid || !trimmedPassword) {
        console.log("Missing userid or password in the request.");
        return response.status(400).send("User ID and password are required");
    }

    mysqlConnection.query('SELECT * FROM users WHERE userid = ? AND password = ?', [trimmedUserid, trimmedPassword], function(error, results) {
        if (error) {
            console.error("Database query error:", error);
            return response.status(500).send("Internal Server Error");
        }

        if (results.length > 0) {
            return response.json({ message: "Login successful" });
        } else {
            return response.status(401).json({ message: "Invalid credentials" });
        }
        
    });
}

//This is common for both angular(Home page) and react(User Crud)
app.get('/getall', displayAllUsers);
app.get('/getbyId', getuserbyId);
app.get('/getbyName', getuserbyName);
app.post('/insert', createUser);
app.delete('/delete/:uid', deleteUser);
app.post('/update', updateUser);

//This one for angular project
app.post('/login', loginUser);

app.listen(4000, function() {
    console.log("Server started on port 4000");
});

// Import dependencies.
const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
const app = express();
let dotenv = require('dotenv').config();
const bodyParser = require("body-parser");

// Use dependencies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

// Store .env data.
const connection = dotenv.parsed.CONNECTION;
const port = process.env.PORT || 3001;

// Import controllers.
const OrganisationalUnitController = require('./controllers/organisationalUnit.controller');
const UserController = require('./controllers/user.controller');

// Set up DB connection.
let mongoose = require('mongoose');
const uri = connection;
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect(uri);

mongoose.connection.on('error', function () {
    console.log('Connection to Mongo established.');
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function () {
    console.log("Successfully connected to the database.");
})

// ---------- Users Collection ----------
// Login (POST): checks user credentials and logs user in.
app.post('/login', UserController.loginUser);

// Register (POST): checks user credentials and registers (i.e. creates) new user.
app.post('/register', UserController.registerNewUser);

// Get All Users (GET): gets all users' usernames and roles from users collection.
app.get('/users', UserController.getUsers);

// Change User Role (PUT): updates a user's role in the Users collection
app.put('/change-user-role', UserController.changeUserRole);


// ---------- Organisational Units Collecton ----------
// Get OUs (GET): gets all OUs that the user has access to, based on their roles.
app.get('/organisational-units', OrganisationalUnitController.getOUs);

// Add Credential Repo (POST): adds a new credential repo to a division in an OU.
app.post('/add-credential-repo', OrganisationalUnitController.addCredentialRepo);

//  Update Credential Repo (PUT): updates a credential repo at a specified division in an OU.
app.put('/update-credential-repo', OrganisationalUnitController.updateCredentialRepo);

// Unassign User From OU (PUT): removes a user from the OU's ouUsers array and from all its 
// division's divisionUsers arrays.
app.put('/unassign-from-ou', OrganisationalUnitController.unassignOuUser);

// Unassign User From Division (PUT): removes a user from a specified division within a specified OU. 
app.put('/unassign-from-division', OrganisationalUnitController.unassignDivisionUser);

// Assign User To OU And Division  (PUT): assigns a selected user to a new OU, 
// with the option to also assign to a division within that OU. 
app.put('/assign-user', OrganisationalUnitController.assignToNewOU);


// ---------- Listen on port 3001 (or default) ----------
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})

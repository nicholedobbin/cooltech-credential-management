// Import schema.
const UserModel = require('../models/user');

// Import dependencies.
const jwt = require('jsonwebtoken');

// Store .env data.
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// ---------- Login (POST) ----------
// Checks user credentials and logs user in.
exports.loginUser = async function (req, res) {
    // Create empty customResponse object to store data sent to front end.
    let customResponse = {};

    // Find a user in the users collection that matches the req.body username and password.
    const user = await UserModel.findOne({
        username: req.body.username,
        password: req.body.password
    });

    // If there is no user found, set and send custom response.
    if (!user) {
        customResponse = {
            message: 'Incorrect login! No user found with those credentials.'
        }
        res.send(customResponse);
    }
    // Else, the user is found:
    else {
        // Set the payload to the user object's values. 
        payload = {
            'username': user.username,
            'password': user.password,
            'role': user.role
        }

        // Generate token.
        const token = jwt.sign(JSON.stringify(payload), jwtSecretKey, { algorithm: 'HS256' });

        // Update customResponse with data to send to front-end.
        customResponse = {
            message: 'User found!',
            username: user.username,
            token: 'Bearer ' + token
        }

        // Send custom response.
        res.send(customResponse);
    }
}

// ---------- Register (POST) ----------
// Checks user credentials and registers (i.e. creates) new user.
exports.registerNewUser = async function (req, res) {
    // Create empty customResponse object to store data sent to front end.
    let customResponse = {};

    // Find a user in the users collection that matches the req.body username and password.
    const userIsFound = await UserModel.findOne({
        username: req.body.username
    });

    // If there is a user with the same credentials found in the users collection, send custom response.
    if (userIsFound) {
        customResponse = {
            message:
                `User already exists. Please register with different credentials or login with existing credentials.`,
            successKey: false
        }
        res.send(customResponse);
    }
    // Else, if there is no user in the collection with those credentials:
    else {
        // Create newUser object with credentials from req.body.
        // Note: The userModel's default value for the 'role' field is 'normal', so
        // the newUser is automatically assigned a role of 'normal' when registering.
        let newUser = new UserModel({
            username: req.body.username,
            password: req.body.password
        });

        // Save newUser object to Users collection and send custom response.
        newUser.save(function (err, data) {
            if (err) {
                customResponse = {
                    message: 'Error saving new user!',
                    successKey: false,
                    data: err
                }
                res.send(customResponse);
            }
            else {
                // Set the payload to the newUser object's values. 
                payload = {
                    'username': newUser.username,
                    'password': newUser.password,
                    'role': newUser.role
                }

                // Generate token.
                const token = jwt.sign(JSON.stringify(payload), jwtSecretKey, { algorithm: 'HS256' });

                // Create custom response with message, newUser data and JWT.
                customResponse = {
                    message: 'New user registered and found!',
                    successKey: true,
                    username: newUser.username,
                    token: 'Bearer ' + token
                }

                // Send custom response.
                res.send(customResponse);
            }
        })
    }
}

// ---------- Get All Users (GET) ----------
// Gets all users' usernames and roles from users collection.
exports.getUsers = async function (req, res) {
    // Create customResponse to store data sent to front-end.
    let customResponse;

    // Initialise allUsersData object to store arrays of user objects according to their roles.
    let allUsersData = {
        "normalUsers": [],
        "managementUsers": [],
        "adminUsers": []
    }

    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];

    try {
        // Decode token to get user's username and role.
        const decoded = jwt.verify(token, jwtSecretKey);

        // If the user is admin:
        if (decoded.role === 'admin') {

            // Find all OUs that the user has access to, based on their roles.
            UserModel.find((err, users) => {
                // If there's an error, send custom response.
                if (err) {
                    console.log(err);
                    customResponse = {
                        message: 'Error! Your JWT was verified, but you do not have access to this collection.',
                        error: err
                    }
                }
                else {
                    // Map through the users collection, check each user's role, and store relevant user data. 
                    users.map((user) => {
                        // If the user's role is 'normal', create and push tempUser to allUsersData's normalUsers array.
                        if (user.role === 'normal') {
                            tempUser = {
                                "_id": user._id,
                                "username": user.username,
                                "role": user.role
                            }
                            allUsersData.normalUsers.push(tempUser);
                        }
                        // Else, if the user's role is 'management', create and push tempUser to allUsersData's managementUsers array.
                        else if (user.role === 'management') {
                            tempUser = {
                                "_id": user._id,
                                "username": user.username,
                                "role": user.role
                            }
                            allUsersData.managementUsers.push(user);
                        }
                        // Else, if the user's role is 'admin', create and push tempUser to allUsersData's adminUsers array.
                        else if (user.role === 'admin') {
                            tempUser = {
                                "_id": user._id,
                                "username": user.username,
                                "role": user.role
                            }
                            allUsersData.adminUsers.push(user);
                        }
                    })

                    // Create and send custom response with users data.
                    customResponse = {
                        message: 'Success! Your JWT was verified and you have access to the Users collection.',
                        username: decoded.username,
                        role: decoded.role,
                        usersData: allUsersData
                    }
                    res.send(customResponse);
                }
            })
        } else {
            // Else, (i.e. if the user's role is not admin), send custom response.
            customResponse = {
                message: `Failed! Your JWT was verified but you do not have access to the 'users' collection.`,
                successKey: false
            }
            res.send(customResponse);
        }

    } catch (err) {
        // Catch and send any JWT authorization errors in a custom response.
        customResponse = {
            message: 'Error! Unauthorized request - bad JWT.',
            data: err,
            successKey: false
        }
        res.send(customResponse);
    }
}

// ---------- Change User Role (PUT) ----------
// Updates a user's role in the Users collection.
exports.changeUserRole = async function (req, res) {
    // Store inputted form data from req.body (UsersCard component).
    let selectedUserName = req.body.selectedUserName;
    let selectedRole = req.body.selectedRole;

    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];

    // Create customResponse to store data sent to front-end.
    let customResponse;

    // Create variable to store old user role.
    let oldUserRole;

    try {
        // Decode token to get user's data.
        const decoded = jwt.verify(token, jwtSecretKey);

        // If the user is admin:
        if (decoded.role === 'admin') {
            // Find the selected user.
            let fetchedUser = await UserModel.findOne({ username: selectedUserName });

            // Save the selected user's old user role (for custom success response).
            oldUserRole = fetchedUser.role;

            // If the older user role is the same as the selected user role, send custom response that
            // the user role can't be changed to the same role.
            if (oldUserRole === selectedRole) {
                customResponse = {
                    message: `Failed! ${selectedUserName} is already '${selectedRole}'. Please select a different role.`,
                    successKey: false
                }
                res.send(customResponse);
            } else {
                // Else, update the fetchedUser's role by setting its property to the selectedRole.
                fetchedUser.role = selectedRole;

                // Save the updated fetchedUser and send custom response.
                fetchedUser.save(function (err, data) {
                    if (err) {
                        customResponse = {
                            message: `Error! Failed to save updated user role: \n ${err}`,
                            successKey: false,
                        }
                        res.send(customResponse);
                    }
                    else {
                        customResponse = {
                            message: `Success! ${selectedUserName}'s role has been changed from '${oldUserRole}' to '${selectedRole}'.`,
                            successKey: true
                        }
                        res.send(customResponse);
                    }
                });
            }
        } else {
            // Else, (i.e. if the user's role is not admin), send custom response.
            customResponse = {
                message: `Failed! Your JWT was verified but you do not have access to the 'users' collection.`,
                successKey: false
            }
            res.send(customResponse);
        }

    } catch (err) {
        // Catch and send any JWT authorization errors in a custom response.
        customResponse = {
            message: 'Error! Unauthorized request - bad JWT.',
            data: err,
            successKey: false
        }
        res.send(customResponse);
    }
}


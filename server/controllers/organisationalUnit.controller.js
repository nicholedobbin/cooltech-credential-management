// Import schema.
const OrganisationalUnitModel = require('../models/organisationalUnit');
const NewCredentialRepo = require('../models/newCredential');

// Import dependencies.
const jwt = require('jsonwebtoken');

// Store .env data.
let jwtSecretKey = process.env.JWT_SECRET_KEY;

// ---------- Get OUs (GET) ----------
// Gets all OUs that the user has access to, based on their roles.
exports.getOUs = function (req, res) {
    // Create customResponse to store data sent to front end.
    let customResponse;

    // Create array to store OUs.
    let orgUnitsArray = [];

    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];

    try {
        // Decode token to get user details.
        const decoded = jwt.verify(token, jwtSecretKey);

        // Find all OUs that the user has access to, based on their roles.
        OrganisationalUnitModel.find((err, orgUnits) => {
            // If there's an error, send custom response.
            if (err) {
                customResponse = {
                    message: 'Error! Your JWT was verified, but you do not have access to these OUs.',
                    error: err
                }
            }
            else {
                // Else, map through all OUs:
                orgUnits.map((orgUnit) => {
                    // Initialise object to store a single OU's name, divisions array, and nested credentialRepos array.
                    let singleOU = new Object();
                    singleOU.ouName = '';
                    singleOU.divisions = [];

                    // If the user is in this orgUnit's ouUsers array OR if they are admin, add the ouName to the singleOU object. 
                    if (orgUnit.ouUsers.includes(decoded.username) || decoded.role == 'admin') {
                        singleOU.ouName = orgUnit.ouName;
                    }

                    // If the user is admin, add the ouUsers array to the singleOU object.
                    // (This allows only admin users to see the ouUsers list in each OU.)
                    if (decoded.role === 'admin') {
                        singleOU.ouUsers = orgUnit.ouUsers;
                    }

                    // For each division found in the OU's divisions array:  
                    orgUnit.divisions.forEach((division) => {
                        // Create object to store a single division's data.
                        let singleDivision = new Object();

                        // If the user is admin: 
                        if (decoded.role == 'admin') {
                            // Store the divisionName, credentialRepos and divisionUsers in the singleDivision object.
                            singleDivision.divisionName = division.divisionName;
                            singleDivision.divisionUsers = division.divisionUsers;
                            singleDivision.credentialRepos = [];

                            // For each repo found in this division's credentialRepos array:
                            division.credentialRepos.forEach((repo) => {
                                // Initialise a singleRepo object to store the repo's data. 
                                let singleRepo = new Object();
                                singleRepo.repoName = repo.repoName;
                                singleRepo.repoEmail = repo.repoEmail;
                                singleRepo.repoUsername = repo.repoUsername;
                                singleRepo.repoPassword = repo.repoPassword;

                                // Push the singleRepo to the singleDivision object's credentialRepos array.
                                singleDivision.credentialRepos.push(singleRepo);
                            })

                            // Push the singleDivision object to the singleOU object's divisions array.
                            singleOU.divisions.push(singleDivision);
                        }

                        // Else, if the user is in the divisionUsers array but they are not admin:
                        else if (division.divisionUsers.includes(decoded.username) && decoded.role != 'admin') {
                            // Initialise singleDivision object without divisionUsers array.
                            let singleDivision = new Object();
                            singleDivision.divisionName = division.divisionName;
                            singleDivision.credentialRepos = [];

                            // Loop through each credentials repo, create an object to store the repo data 
                            // and push it to the division's credentialRepos array.
                            division.credentialRepos.forEach((repo) => {
                                let singleRepo = new Object();
                                singleRepo.repoName = repo.repoName;
                                singleRepo.repoEmail = repo.repoEmail;
                                singleRepo.repoUsername = repo.repoUsername;
                                singleRepo.repoPassword = repo.repoPassword;

                                singleDivision.credentialRepos.push(singleRepo);
                            })

                            // Push the singleDivision to the OU's divisions array.
                            singleOU.divisions.push(singleDivision);
                        }
                    })

                    // If the singleOU's ouName property is not empty, push it to the orgUnitsArray. 
                    // (The map creates objects for all OUs in the database, but only populates them with data
                    // if the user is in the ouUsers array or if they're admin, so this accounts for 'normal' 
                    // or 'management' users who are not in the ouUsers array).
                    if (singleOU.ouName != '') {
                        orgUnitsArray.push(singleOU);
                    }
                })

                // Create custom response with user and OU data.
                customResponse = {
                    message: 'Success! Your JWT was verified and you have access to these OUs.',
                    username: decoded.username,
                    role: decoded.role,
                    orgUnits: orgUnitsArray
                }
                // Send response to front end, sorted in ascending order.
                res.send(customResponse);
            }
        }).sort({ "_id": 1 })
    } catch (err) {
        // Send any errors caught in a custom response.
        customResponse = {
            message: 'Error! Unauthorized request - bad JWT.',
            data: err
        }
        res.send(customResponse);
    }
}

// ---------- Add Credential Repo (POST) ----------
// Adds a new credential repo to a division in an OU.
exports.addCredentialRepo = async function (req, res) {
    // Store inputted form data from req.body (AddRepoForm component).
    let inputOuName = req.body.inputOuName;
    let inputDivisionName = req.body.inputDivisionName;
    let inputRepoName = req.body.inputRepoName;
    let inputRepoUsername = req.body.inputRepoUsername;
    let inputRepoEmail = req.body.inputRepoEmail;
    let inputRepoPassword = req.body.inputRepoPassword;

    // Create customResponse to store data sent to front-end.
    let customResponse;

    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];

    try {
        // Decode token to get user's data.
        const decoded = jwt.verify(token, jwtSecretKey);

        // Find the OU with the inputted OU name.
        let fetchedOrgUnit = await OrganisationalUnitModel.findOne({ ouName: inputOuName });

        // Create variable to store the found division's index.
        let divisionIndex = 0;

        // If the user is in the OU's ouUsers array, or if they are admin:
        if ((fetchedOrgUnit.ouUsers.indexOf(decoded.username) > -1) || (decoded.role == 'admin')) {
            // Find the inputDivisionName's index.
            divisionIndex = fetchedOrgUnit.divisions.findIndex(div => div.divisionName == inputDivisionName);

            // If the user is in the division's divisionUsers array, or if they are admin:
            if ((fetchedOrgUnit.divisions[divisionIndex].divisionUsers.indexOf(decoded.username) > -1)
                || (decoded.role == 'admin')) {

                // Create a new credential repo object with inputted repo data.
                let newRepo = new NewCredentialRepo({
                    repoName: inputRepoName,
                    repoEmail: inputRepoEmail,
                    repoUsername: inputRepoUsername,
                    repoPassword: inputRepoPassword

                });

                if (newRepo.repoName === '') {
                    customResponse = {
                        message: `Can't have empty repo name. Please add repo name.`,
                        successKey: false
                    }
                    res.send(customResponse);
                } else {
                    // Create repoIsFound variable set to false.
                    let repoIsFound = false;

                    // Loop through the credentialRepos array at this division's index to check if the repoName already exists.
                    fetchedOrgUnit.divisions[divisionIndex].credentialRepos.forEach((repo) => {
                        // If the repoName already exists, set repoIsFound to true.
                        if (repo.repoName === newRepo.repoName) {
                            repoIsFound = true;
                        }
                    })

                    // If repoIsFound is false (i.e. there is no repo with that repoName):
                    if (!repoIsFound) {
                        // Update the OU where the ouName and divisionName matches the inputted names,
                        // and push the newRepo to the credentialRepos array in that division.
                        await OrganisationalUnitModel.updateOne(
                            { 'ouName': inputOuName, 'divisions.divisionName': inputDivisionName },
                            { $push: { 'divisions.$.credentialRepos': newRepo } }
                        )

                        // Create and send custom response.
                        customResponse = {
                            message: `Success! New Credential Repo added to ${inputOuName}'s '${inputDivisionName}' division.`,
                            successKey: true
                        }
                        res.send(customResponse);

                    } else {
                        // Else, (i.e.if that repoName is already used), send response that repo already exists.
                        customResponse = {
                            message: `Repo already exists. Please use a different repoName when adding new credential repos.`,
                            successKey: false
                        }
                        res.send(customResponse);
                    }
                }
            } else {
                // Else, send response that the user does not have access to the division.
                customResponse = {
                    message: `Failed! You don't have access to this Division.`,
                    successKey: false
                }
                res.send(customResponse);
            }

        } else {
            // Else, send response that the user does not have access to the OU.
            customResponse = {
                message: `Failed! You do not have access to this Organisational Unit.`,
                successKey: false
            }
            res.send(customResponse);
        }

    } catch (err) {
        // Send any JWT request errors in a custom response.
        customResponse = {
            message: 'Error! Unauthorized request - bad JWT.',
            successKey: false
        }
        res.send(customResponse);
    }
}

// ---------- Update Credential Repo (PUT) ----------
//  Updates a credential repo at a specified division in an OU.
exports.updateCredentialRepo = async function (req, res) {
    // Store inputted form data from req.body (EditRepoForm component).
    // (Data not to be updated)
    let inputOuName = req.body.inputOuName;
    let inputDivisionName = req.body.inputDivisionName;
    let inputRepoName = req.body.inputRepoName;
    // (Data to be updated)
    let inputRepoUsername = req.body.inputRepoUsername;
    let inputRepoEmail = req.body.inputRepoEmail;
    let inputRepoPassword = req.body.inputRepoPassword;

    // Create customResponse to store data sent to front-end.
    let customResponse;

    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];

    try {
        // Decode token to get user's data.
        const decoded = jwt.verify(token, jwtSecretKey);

        // Find the OU with the inputted OU name.
        let fetchedOrgUnit = await OrganisationalUnitModel.findOne({ ouName: inputOuName });

        // Create variables to store the found division and credential repo indexes.
        let divisionIndex = 0;
        let credRepoIndex = 0;

        // If the user is in the OU's ouUsers array, or if they are admin:
        if ((fetchedOrgUnit.ouUsers.indexOf(decoded.username) > -1) || (decoded.role == 'admin')) {
            // Find the inputDivisionName's index.
            divisionIndex = fetchedOrgUnit.divisions.findIndex(div => div.divisionName == inputDivisionName);
            
            // Find the inputRepoName's index in the division at divisionIndex.
            credRepoIndex = fetchedOrgUnit.divisions[divisionIndex].credentialRepos.findIndex(repo => repo.repoName === inputRepoName);

            // If the user's role is admin or management:
            if ((decoded.role == 'management') || (decoded.role == 'admin')) {
                // Ensure only valid inputs are updated by checking if the input data is true. 
                // If they contain data, update the fetchedOrgUnit's repo values at their specified keys and indexes. 
                if (inputRepoUsername) {
                    fetchedOrgUnit.divisions[divisionIndex].credentialRepos[credRepoIndex].repoUsername = inputRepoUsername;
                }

                if (inputRepoEmail) {
                    fetchedOrgUnit.divisions[divisionIndex].credentialRepos[credRepoIndex].repoEmail = inputRepoEmail;
                }

                if (inputRepoPassword) {
                    fetchedOrgUnit.divisions[divisionIndex].credentialRepos[credRepoIndex].repoPassword = inputRepoPassword;
                }

                // Save the updated fetchedOrgUnit and send custom response.
                fetchedOrgUnit.save(function (err, data) {
                    if (err) {
                        customResponse = {
                            message: `Error! Failed to save updated data: \n ${err}`,
                            successKey: false
                        }
                        res.send(customResponse);
                    }
                    else {
                        customResponse = {
                            message: `Success! Updated Credential Repo: '${inputRepoName}' in ${inputOuName}'s ${inputDivisionName} division.`,
                            successKey: true
                        }
                        res.send(customResponse);
                    }
                });

            } else {
                // Else, (i.e. if the user's role is not admin or management), send custom response.
                customResponse = {
                    message: `Failed! You do not have credential repo update permissions.`,
                    successKey: false
                }
                res.send(customResponse);
            }
        }
    } catch (err) {
        // Catch and send any JWT authorization errors in a custom response.
        customResponse = {
            message: 'Error! Unauthorized request - bad JWT.',
            successKey: false
        }
        res.send(customResponse);
    }
}

// ---------- Unassign User From OU (PUT) ----------
// Removes a user from the OU's ouUsers array and from all its division's divisionUsers arrays.
exports.unassignOuUser = async function (req, res) {
    // Store inputted form data from req.body (OuCard component).
    let userName = req.body.userName;
    let ouName = req.body.ouName;

    // Create customResponse to store data sent to front-end.
    let customResponse;

    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];

    try {
        // Decode token to get user's data.
        const decoded = jwt.verify(token, jwtSecretKey);

        // If the user is admin:
        if (decoded.role === 'admin') {

            // Remove the user from the specified OU's ouUsers list.
            await OrganisationalUnitModel.updateMany(
                { ouName: ouName },
                { $pull: { ouUsers: userName } }
            );

            // In the specified OU, remove the user from any divisionUsers lists that they're in.
            // (The $[] finds any  divisionUsers array that matches the userName in all the divisions.
            await OrganisationalUnitModel.updateMany(
                { ouName: ouName },
                { $pull: { "divisions.$[].divisionUsers": userName } }
            );

            // Create and send custom response.
            customResponse = {
                message: `Success! ${userName} has been unassigned from ${ouName}.`,
                successKey: true
            }
            res.send(customResponse);

        } else {
            // Else, (i.e. if the user's role is not admin), send custom response.
            customResponse = {
                message: `Failed! Only admin roles can unassign users.`,
                successKey: false
            }
            res.send(customResponse);
        }

    } catch (err) {
        // Catch and send any JWT authorization errors in a custom response.
        customResponse = {
            message: 'Error! Unauthorized request - bad JWT.',
            successKey: false
        }
        res.send(customResponse);
    }
}

// ---------- Unassign User From Division (PUT) ----------
// Removes a user from a specified division within a specified OU. 
exports.unassignDivisionUser = async function (req, res) {
    // Store inputted form data from req.body (OuCard component).
    let userName = req.body.userName;
    let ouName = req.body.ouName;
    let divisionName = req.body.divisionName;

    // Create customResponse to store data sent to front-end.
    let customResponse;

    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];

    try {
        // Decode token to get user's username and role.
        const decoded = jwt.verify(token, jwtSecretKey);

        // If the user is admin:
        if (decoded.role === 'admin') {
            // Remove the user from the divisionUsers array where the OU name and division name match the inputted names.
            await OrganisationalUnitModel.updateOne(
                { "ouName": ouName, "divisions.divisionName": divisionName },
                { $pull: { "divisions.$.divisionUsers": userName } }
            );

            // Create and send custom response.
            customResponse = {
                message: `Success! ${userName} has been unassigned from ${divisionName}.`,
                successKey: true
            }
            res.send(customResponse);

        } else {
            // Else, (i.e. if the user's role is not admin), send custom response.
            customResponse = {
                message: `Failed! Only admin roles can unassign users.`,
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

// ---------- Assign User To OU And Division  (PUT) ----------
// Assigns a selected user to a new OU, with the option to also assign to a division within that OU. 
exports.assignToNewOU = async function (req, res) {
    // Store inputted form data from req.body (EditRepoForm component).
    let selectedUserName = req.body.selectedUserName;
    let selectedOU = req.body.selectedOU;
    let selectedDivision = req.body.selectedDivision;

    // Create customResponse to store data sent to front-end.
    let customResponse;

    // Get user token from req.headers.
    const token = req.headers['authorization'].split(' ')[1];

    try {
        // Decode token to get user's data.
        const decoded = jwt.verify(token, jwtSecretKey);

        // Find the OU with the selectedOU name.
        let fetchedOrgUnit = await OrganisationalUnitModel.findOne({ ouName: selectedOU });

        // Create variables to store the found Division index.
        let divisionIndex = 0;

        // If the user is admin:
        if ((decoded.role == 'admin')) {
            // (1) If the selected user is already in the OU and is not being assigned to a division:  
            if ((fetchedOrgUnit.ouUsers.includes(selectedUserName)) && (selectedDivision === 'none')) {
                // Create and send response that user cannot be assigned to the same OU.
                customResponse = {
                    message:
                        `Failed! User is already assigned to OU: '${fetchedOrgUnit.ouName}'. Cannot assign to same OU.`,
                    successKey: false
                }
                res.send(customResponse);
            }

            // (2) Else, if the selected user is already in the OU and is only being assigned to a division:
            else if ((fetchedOrgUnit.ouUsers.includes(selectedUserName)) && (selectedDivision != 'none')) {
                // Find the inputDivisionName's index.
                divisionIndex = fetchedOrgUnit.divisions.findIndex(div => div.divisionName == selectedDivision);

                // If the selected user is already assigned to this division, send response stating this. 
                if (fetchedOrgUnit.divisions[divisionIndex].divisionUsers.includes(selectedUserName)) {
                    customResponse = {
                        message: `Failed! User is already assigned to Division: '${fetchedOrgUnit.divisions[divisionIndex].divisionName}'
                        in OU: '${fetchedOrgUnit.ouName}'. Cannot assign to same division.`,
                        successKey: false
                    }
                    res.send(customResponse);
                }
                // Else (i.e. if the selected user is not already assigned to this division): 
                else {
                    // Push the selectedUsername to the selectedDivision's divisionUsers array.
                    fetchedOrgUnit.divisions[divisionIndex].divisionUsers.push(selectedUserName);

                    // Save the updated fetchedOrgUnit with user added to division and send custom response.
                    fetchedOrgUnit.save(function (err, data) {
                        if (err) {
                            customResponse = {
                                message: `Error! Failed to save updated data: \n ${err}`,
                                successKey: false,
                            }
                            res.send(customResponse);
                        }
                        else {
                            customResponse = {
                                message: `Success! User is assigned to Division: '${selectedDivision}'. `,
                                successKey: true
                            }
                            res.send(customResponse);
                        }
                    });
                }
            }

            // (3) Else, if the user being assigned to an OU only (and not a division): 
            else if ((!fetchedOrgUnit.ouUsers.includes(selectedUserName)) && (selectedDivision === 'none')) {
                // Push the selected user to the ouUsers array.
                fetchedOrgUnit.ouUsers.push(selectedUserName);

                // Save the updated fetchedOrgUnit with user added to OU and send custom response.
                fetchedOrgUnit.save(function (err, data) {
                    if (err) {
                        customResponse = {
                            message: `Error! Failed to save updated data: \n ${err}`,
                            successKey: false
                        }
                        res.send(customResponse);
                    }
                    else {
                        customResponse = {
                            message: `Success! User is assigned to OU: '${fetchedOrgUnit.ouName}'. `,
                            successKey: true
                        }
                        res.send(customResponse);
                    }
                });
            }

            // (4) Else, if the is being assigned to both an OU and a Division in that OU: 
            else if ((!fetchedOrgUnit.ouUsers.includes(selectedUserName)) && (selectedDivision != 'none')) {
                // Find the inputDivisionName's index.
                divisionIndex = fetchedOrgUnit.divisions.findIndex(div => div.divisionName == selectedDivision);

                // Push the selected user to the ouUsers array.
                fetchedOrgUnit.ouUsers.push(selectedUserName);

                // Push the selected user to the selectedDivision's divisionUsers array.
                fetchedOrgUnit.divisions[divisionIndex].divisionUsers.push(selectedUserName);

                // Save the updated fetchedOrgUnit with user added to both OU and Division, and send custom response.
                fetchedOrgUnit.save(function (err, data) {
                    if (err) {
                        customResponse = {
                            message: `Error! Failed to save updated data: \n ${err}`,
                            successKey: false
                        }
                        res.send(customResponse);
                    }
                    else {
                        customResponse = {
                            message: `Success! User is assigned to OU: '${fetchedOrgUnit.ouName}' 
                            and Division: '${fetchedOrgUnit.divisions[divisionIndex].divisionName}'.`,
                            successKey: true
                        }
                        res.send(customResponse);
                    }
                });
            }

            // (5) Do I need this extra else at the end for any other combinations I might not have thought of? If so, what to send?
            else {
                customResponse = {
                    message: `An error occured.`,
                    successKey: false
                }
                res.send(customResponse);
            }

        } else {
            // Else (i.e. if the user is not admin), send custom response with acces denied.
            customResponse = {
                message: `Failed! Only admin roles can assign users to OUs and Divisions.`,
                successKey: false
            }
            res.send(customResponse);
        }
    } catch (err) {
        // Catch and send any JWT authorization errors in a custom response.
        customResponse = {
            message: 'Error! Unauthorized request - bad JWT.',
            successKey: false
        }
        res.send(customResponse);
    }
}
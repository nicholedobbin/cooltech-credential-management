// Import dependencies.
const mongoose = require('mongoose');

// Credential Repos schema.
let credentialRepoSchema = new mongoose.Schema({
    repoName: {
        type: String,
        required: true
    },
    repoEmail: {
        type: String,
        required: true
    },
    repoUsername: {
        type: String,
        required: true
    },
    repoPassword: {
        type: String,
        required: true
    }
});

// Divisions schema.
let divisionSchema = new mongoose.Schema({
    divisionName: {
        type: String,
        required: true
    },
    divisionUsers: [],
    // Get credentialRepoSchema for nested credential repos documents.
    credentialRepos: [credentialRepoSchema]
});

// Organisational Unit schema.
let organisationalUnitSchema = new mongoose.Schema({
    ouName: {
        type: String,
        required: true
    },
    ouUsers: [],
    // Get divisionSchema for nested division documents.
    divisions: [divisionSchema]
});

// Create and export OrganisationalUnit model.
let OrganisationalUnit = mongoose.model('OrganisationalUnit', organisationalUnitSchema);

module.exports = OrganisationalUnit;
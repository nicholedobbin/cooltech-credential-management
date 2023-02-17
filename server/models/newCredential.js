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

// Create and export OrganisationalUnit model.
let NewCredentialRepo = mongoose.model('NewCredentialRepo', credentialRepoSchema);

module.exports = NewCredentialRepo;
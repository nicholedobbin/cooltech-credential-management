import React, { useState, useEffect } from 'react';

// Import Bootstrap components.
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


export default function EditRepoForm({
    userData,
    ouData,
    setOuData,
    formOuName,
    setFormOuName,
    formDivisionName,
    setFormDivisionName,
    formRepoName,
    setFormRepoName,
    showEditRepoForm,
    setShowEditRepoForm
}) {
    // ---------- Set States ----------
    // For UpdateRepoForm's inputted data.
    const [inputOuName, setInputOuName] = useState('');
    const [inputDivisionName, setInputDivisionName] = useState('');
    const [inputRepoName, setInputRepoName] = useState('');
    const [inputRepoUsername, setInputRepoUsername] = useState('');
    const [inputRepoEmail, setInputRepoEmail] = useState('');
    const [inputRepoPassword, setInputRepoPassword] = useState('');

    // For displaying error messages.
    const [error, setError] = useState();

    // For displaying success messages.
    const [success, setSuccess] = useState();

    // ---------- Use Effect ----------
    // Checks and sets the inputOuName, inputDivisionName and inputRepoName to be sent to server (this ensures the repo sent  
    // to the back-end is updated at the correct repoName in the correct OU's division).
    useEffect(() => {
        // Loop through the OUs, their divisions and their credential repos.
        ouData.orgUnits.forEach((orgUnit) => {
            // If the ouName, divisionName, and repoName matches the inputted formOuName, formDivisionName, 
            // and formRepoName, set the inputOuName, inputDivisionName and inputRepoName to these values.
            if (orgUnit.ouName === formOuName) {
                orgUnit.divisions.forEach((division) => {
                    if (division.divisionName === formDivisionName) {
                        division.credentialRepos.forEach((repo) => {
                            if (repo.repoName === formRepoName) {
                                setInputOuName(formOuName);
                                setInputDivisionName(formDivisionName);
                                setInputRepoName(formRepoName);
                            }
                        })
                    }
                })
            }
        })
    }, [formDivisionName, formOuName, formRepoName, ouData.orgUnits])

    // ---------- User Token ----------
    // Store token for CRUD requests' Authorization Headers.
    const userToken = userData.token;

    // ---------- Handle Error Messages ----------
    // Hides error message when error notification's 'close' button is clicked.
    const handleHideError = () => {
        setError(null);
    }

    // ---------- Handle Success Messages ----------
    // Hides success message when succes notification's 'close' button is clicked.
    const handleHideSuccess = () => {
        setSuccess(null);
    }

    // ---------- Handle Update Repo ----------
    //  Updates a credential repo at a specified division in an OU.
    const handleSubmit = async (e) => {
        // Prevent default page reload.
        e.preventDefault();

        // Create object to store inputted repo data.
        const updatedRepo = { inputOuName, inputDivisionName, inputRepoName, inputRepoUsername, inputRepoEmail, inputRepoPassword };

        // Store request options for PUT Update Repo request.
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRepo)
        };

        // Send PUT Update Repo request to endpoint.
        const response = await fetch(`/update-credential-repo`, requestOptions);

        //Store JSON data from response.
        const jsonUpdateRepoData = await response.json();

        // If there is an error with the fetch request, set error state to jsonUpdateRepoData.
        if (!response.ok) {
            setError(jsonUpdateRepoData);
        }

        // If there is no error with the fetch request:
        if (response.ok) {
            // If the jsonData successKey is false:
            if (!jsonUpdateRepoData.successKey) {
                // Reset states so form can be re-entered.
                setFormOuName('');
                setFormDivisionName('');
                setFormRepoName('');
                setInputOuName('');
                setInputDivisionName('');
                setInputRepoName('');
                setInputRepoUsername('');
                setInputRepoEmail('');
                setInputRepoPassword('');

                // Set success key to null.
                setSuccess(null);

                // Set error to jsonData's error message.
                setError(jsonUpdateRepoData.message);

                // Set timeout for error message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setError(null)
                }, 3000);

            } else {
                // Else (i.e. if the successKey is true), reset states so form can be re-entered.
                setFormOuName('');
                setFormDivisionName('');
                setFormRepoName('');
                setInputOuName('');
                setInputDivisionName('');
                setInputRepoName('');
                setInputRepoUsername('');
                setInputRepoEmail('');
                setInputRepoPassword('');

                // Set error state to null.
                setError(null);

                // Store request options for GET OU Data request.
                const getOUsRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }

                // Fetch and set all OU data again so that it is updated in the browser.
                const response = await fetch('/organisational-units', getOUsRequestOptions);
                const jsonOUsData = await response.json();
                setOuData(jsonOUsData);

                // Set success state to jsonData's success message.
                setSuccess(jsonUpdateRepoData.message);

                // Set timeout for success message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setSuccess(null)
                }, 3000);
            }
        }
        // Reset setShowEditRepoForm state back to false (to remove the form).
        setShowEditRepoForm(false);
    }

    return (
        <>
            {/* ---------- Error/Success Messages ---------- */}
            <div className="editRepoFormMessages mx-auto">
                {/* When error state is true, display error message above form card. */}
                {error &&
                    <Container className="error border border-danger border-2">
                        <Row>
                            <Col className="text-end">
                                <p className="closeMessageButton" onClick={handleHideError}>
                                    close
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>{error}</p>
                            </Col>
                        </Row>
                    </Container>
                }

                {/* When success state is true, display success message above form card. */}
                {success &&
                    <Container className="success border border-success border-2">
                        <Row>
                            <Col className="text-end">
                                <p className="closeMessageButton" onClick={handleHideSuccess}>
                                    close
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p>{success}</p>
                            </Col>
                        </Row>
                    </Container>
                }
            </div>

            {/* ---------- Edit Repo Form ---------- */}
            {/* When showEditRepoForm state is true, display EditRepoForm. */}
            {showEditRepoForm &&
                <Card className="addRepoForm my-4">
                    <Card.Header>Update a credential repository:</Card.Header>
                    <Card.Body>
                        {/* Name of OU, Division and Credential Repo where repo will be updated. */}
                        <p className="text-muted">
                            Organisational Unit: "{formOuName}"
                            <br></br>
                            Division: "{formDivisionName}"
                            <br></br>
                            Credential Repo Name: "{formRepoName}"
                        </p>

                        {/* Form for updating repo. */}
                        <Form onSubmit={(handleSubmit)} className="editRepoForm " >
                            {/* Repo Username input. */}
                            <Form.Group as={Row} className="mb-3" controlId="formRepoUsername">
                                <Form.Label column sm={5}>Update Username:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoUsername"
                                        value={inputRepoUsername}
                                        onChange={e => setInputRepoUsername(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>

                            {/* Repo Email input. */}
                            <Form.Group as={Row} className="mb-3" controlId="formRepoEmail">
                                <Form.Label column sm={5}>Update Email:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoEmail"
                                        value={inputRepoEmail}
                                        onChange={e => setInputRepoEmail(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>

                            {/* Repo Password input */}
                            <Form.Group as={Row} className="mb-3" controlId="formRepoPassword">
                                <Form.Label column sm={5}>Update Password:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoPassword"
                                        value={inputRepoPassword}
                                        onChange={e => setInputRepoPassword(e.target.value)}
                                    />
                                </Col>
                            </Form.Group>

                            {/* Submit button */}
                            <Form.Group as={Row} >
                                <Col sm={{ span: 12 }}>
                                    <Button type="submit" className="my-4">Update repo</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            }
        </>
    )
}


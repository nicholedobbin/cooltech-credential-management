import React, { useState, useEffect } from 'react';

// Import Bootstrap components.
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


export default function AddRepoForm({
    userData,
    ouData,
    setOuData,
    formOuName,
    setFormOuName,
    formDivisionName,
    setFormDivisionName,
    setFormRepoName,
    showAddRepoForm,
    setShowAddRepoForm
}) {
    // ---------- Set States ----------
    // For AddRepoForm's inputted data.
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
    // Checks and sets the inputOuName and inputDivisionName to be sent to server (this ensures the repo sent  
    // to the back-end is pushed to the correct division in the correct OU).
    useEffect(() => {
        // Loop through the OUs and their divisions. 
        ouData.orgUnits.forEach((orgUnit) => {
            // If the ouName and divisionName matches the inputted formOuName and formDivisionName, 
            // set the inputOuName and inputDivisionName to these values.
            if (orgUnit.ouName === formOuName) {
                orgUnit.divisions.forEach((division) => {
                    if (division.divisionName === formDivisionName) {
                        setInputOuName(formOuName);
                        setInputDivisionName(formDivisionName);
                    }
                })
            }
        })
    }, [formDivisionName, formOuName, ouData.orgUnits])

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

    // ---------- Handle Add Repo ----------
    // Adds a new credential repo to a division in an OU.
    const handleSubmit = async (e) => {
        // Prevent default page reload.
        e.preventDefault();

        // Create object to store inputted repo data.
        const repo = { inputOuName, inputDivisionName, inputRepoName, inputRepoUsername, inputRepoEmail, inputRepoPassword };

        // Store request options for POST Add Repo request.
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(repo)
        };

        // Send POST Add Repo request to endpoint.
        const response = await fetch('/add-credential-repo', requestOptions);

        // Store JSON data from response.
        const jsonAddRepoData = await response.json();

        // If there is an error with the fetch request, set error state to jsonAddRepoData.
        if (!response.ok) {
            setError(jsonAddRepoData);
        }

        // If there is no error with the fetch request:
        if (response.ok) {
            // If the jsonData successKey is false:
            if (!jsonAddRepoData.successKey) {
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
                setError(jsonAddRepoData.message);

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
                const jsonOuData = await response.json();
                setOuData(jsonOuData);

                // Set success state to jsonData's success message.
                setSuccess(jsonAddRepoData.message);

                // Set timeout for success message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setSuccess(null)
                }, 3000);
            }
        }
        // Reset setShowAddRepoForm state back to false (to remove the form).
        setShowAddRepoForm(false);
    }

    return (
        <>
            {/* ---------- Error/Success Messages ---------- */}
            <div className="addRepoFormMessages mx-auto">
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

            {/* ---------- Add Repo Form ---------- */}
            {/* When showAddRepoForm state is true, display AddRepoForm. */}
            {showAddRepoForm &&
                <Card className="addRepoForm my-4">
                    <Card.Header>Add a new credential repository:</Card.Header>
                    <Card.Body>
                        {/* Name of OU and Division where repo will be added. */}
                        <p className="text-muted">
                            Organisational Unit: "{formOuName}"
                            <br></br>
                            Division: "{formDivisionName}"
                        </p>

                        {/* Form for adding new repo. */}
                        <Form onSubmit={handleSubmit} className="addRepoForm " >
                            {/* Repo Name input. */}
                            <Form.Group as={Row} className="mb-3" controlId="formRepoName">
                                <Form.Label column sm={5}>Repo Name:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoName"
                                        onChange={e => setInputRepoName(e.target.value)}
                                        value={inputRepoName}
                                    />
                                </Col>
                            </Form.Group>

                            {/* Repo Username input */}
                            <Form.Group as={Row} className="mb-3" controlId="formRepoUsername">
                                <Form.Label column sm={5}>Repo Username:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoUsername"
                                        onChange={e => setInputRepoUsername(e.target.value)}
                                        value={inputRepoUsername}
                                    />
                                </Col>
                            </Form.Group>

                            {/* Repo Email input */}
                            <Form.Group as={Row} className="mb-3" controlId="formRepoEmail">
                                <Form.Label column sm={5}>Repo Email:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoEmail"
                                        onChange={e => setInputRepoEmail(e.target.value)}
                                        value={inputRepoEmail}
                                    />
                                </Col>
                            </Form.Group>

                            {/* Repo Password input */}
                            <Form.Group as={Row} className="mb-3" controlId="formRepoPassword">
                                <Form.Label column sm={5}>Repo Password:</Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        type="text"
                                        name="repoPassword"
                                        onChange={e => setInputRepoPassword(e.target.value)}
                                        value={inputRepoPassword}
                                    />
                                </Col>
                            </Form.Group>

                            {/* Submit button */}
                            <Form.Group as={Row} >
                                <Col sm={{ span: 12 }}>
                                    <Button type="submit" className="my-4">Add Repo</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            }
        </>
    )
}

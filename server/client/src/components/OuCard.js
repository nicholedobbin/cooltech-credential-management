import React, { useState } from 'react';

// Import Bootstrap components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';

export default function OuCard({
    ouData,
    userData,
    setOuData,
    setFormOuName,
    setFormDivisionName,
    setFormRepoName,
    setShowAddRepoForm,
    setShowEditRepoForm
}) {
    /// ---------- Set States ----------
    // For displaying error messages.
    const [error, setError] = useState();

    // For displaying success messages.
    const [success, setSuccess] = useState();

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

    // ---------- Handle 'Add New Repo' Button Click (Credential Repos Tab) ----------
    // Displays the AddRepoForm component for adding a new credential repo to the selected OU and Division.
    const displayAddRepoForm = async (divisionName, ouName) => {
        // Set form's OU and Division states to the inputted parameters.
        setFormDivisionName(divisionName);
        setFormOuName(ouName);

        // Set showAddRepoForm state to true (to display it in the Forms column).
        setShowAddRepoForm(true);

        // Scroll window to the top of the page (to view form).
        window.scrollTo(0, 0);
    }

    // ---------- Handle 'Edit Repo' Button Click (Credential Repos Tab) ----------
    // Displays the EditRepoForm for editing the selected repo's data in the credential repos tables. 
    const displayEditRepoForm = async (repoName, divisionName, ouName) => {
        /// Set form's OU, Division and RepoName states to the inputted parameters.
        setFormRepoName(repoName);
        setFormDivisionName(divisionName);
        setFormOuName(ouName);

        // Set setShowEditRepoForm state to true (to display it in the Forms column).
        setShowEditRepoForm(true);

        // Scroll window to the top of the page.
        window.scrollTo(0, 0);
    }

    // ---------- Unassign Users from OU (OU Users Tab) ----------
    // Removes a user from the OU's ouUsers array and from all its Division's divisionUsers arrays.
    const unassignFromOu = async (userName, ouName) => {
        // Store token for CRUD request's Authorization Headers.
        const userToken = userData.token;

        // Create and store request body for requestOptions.
        let requestBody = {
            "userName": userName,
            "ouName": ouName
        }

        // Store request options for PUT Unassign From OU request.
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };

        // PUT Unassign From OU request to endpoint.
        const response = await fetch('/unassign-from-ou', requestOptions);

        //  Store JSON data from response.
        const jsonUnassignData = await response.json();

        // If there is an error with the fetch request, set error state to jsonData.
        if (!response.ok) {
            setError(jsonUnassignData);
        }

        // If there is no error with the fetch request:
        if (response.ok) {
            // If the jsonData successKey is false:
            if (!jsonUnassignData.successKey) {
                // Set success key to null.
                setSuccess(null);

                // Set error to jsonData's error message.
                setError(jsonUnassignData.message);

                // Set timeout for error message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setError(null)
                }, 3000);

            } else {
                // Else (i.e. if the successKey is true), set error state to null.
                setError(null);

                // Store request options for GET ouData request.
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

                // Set success state to jsonUnassignData's success message.
                setSuccess(jsonUnassignData.message);

                // Set timeout for success message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setSuccess(null)
                }, 3000);
            }
        }
    }

    // ---------- Unassign Users from Divisions (Division Users Tab) ----------
    // Removes a user from a specified division within a specified OU.
    const unassignFromDivision = async (userName, ouName, divisionName) => {
        // Store token for CRUD request's Authorization Headers.
        const userToken = userData.token;

        // Create and store request body for requestOptions.
        let requestBody = {
            "userName": userName,
            "ouName": ouName,
            "divisionName": divisionName
        }

        // Store request options for PUT Unassign From Division request.
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };

        // PUT Unassign From Division request to endpoint.
        const response = await fetch('/unassign-from-division', requestOptions);

        // Store JSON data from response.
        const jsonUnassignData = await response.json();

        // If there's an error with the fetch request, set error state to jsonData.
        if (!response.ok) {
            setError(jsonUnassignData);
        }

        // If there is no error with the fetch request:
        if (response.ok) {
            // If the jsonData successKey is false:
            if (!jsonUnassignData.successKey) {
                // Set success key to null.
                setSuccess(null);

                // Set error to jsonData's error message.
                setError(jsonUnassignData.message);

                // Set timeout for error message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setError(null)
                }, 3000);

            } else {
                // Else (i.e. if the successKey is true), set error state to null.
                setError(null);

                // Store request options for GET ouData request.
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

                // Set success state to jsonUnassignData's success message.
                setSuccess(jsonUnassignData.message);

                // Set timeout for success message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setSuccess(null)
                }, 3000);
            }
        }
    }

    return (
        <>
            {/* ---------- Success/Error Messages ---------- */}
            {/* When error state is true, display error message above OU Cards. */}
            {error &&
                <Container className="errorMessage border border-danger border-2 mb-3">
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

            {/* When success state is true, display success message above OU Cards. */}
            {success &&
                <Container className="successMessage border border-success border-2 mb-3">
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

            {/* ---------- OU Cards ---------- */}
            {/* Map through ouData's orgUnits and return tabbed cards with relevent OU details. */}
            {ouData.orgUnits.map((orgUnit, unitIndex) => {
                // Create isAssignedToDivs varibale (set to false).
                let isAssignedToDivs = false;

                // If the OU's divisions length is greater than 0 (i.e., the user is assigned to a division in this OU):
                if (orgUnit.divisions.length > 0) {
                    // Set isAssignedToDivs to true.
                    isAssignedToDivs = true;
                }

                // If the user is assigned to divisions in this OU, return card with OU, Divisions and Credential Repos data.
                if (isAssignedToDivs) {
                    return (
                        <Card key={unitIndex} className="my-4 ms-4 me-3">
                            <Tabs defaultActiveKey="overview" className="tabs">

                                {/* --- Overview Tab --- */}
                                <Tab eventKey="overview" title="Overview" className="overviewTab">
                                    <Card.Body className="overviewDetails">
                                        {/* OU name and subtitle. */}
                                        <Card.Title>Organisational Unit: {orgUnit.ouName}</Card.Title>
                                        <Card.Subtitle className="py-3 text-start">
                                            You have access to the following divisions:
                                        </Card.Subtitle>

                                        {/* OU divisions.*/}
                                        <ListGroup variant="flush" className="divisionsList text-start ">
                                            {/* Map through each division in this orgUnit and return list of division names. */}
                                            {orgUnit.divisions.map((division, divisionIndex) => {
                                                return (
                                                    <ListGroup.Item key={divisionIndex}>
                                                        {division.divisionName}
                                                    </ListGroup.Item>
                                                )
                                            })}
                                        </ListGroup>
                                    </Card.Body>
                                </Tab>

                                {/* --- Credential Repos Tab --- */}
                                <Tab eventKey="credentialRepos" title="Credential Repos" className="credentialReposTab">
                                    <Card.Body key={unitIndex} className="overviewDetails">
                                        {/* Credential Repos title. */}
                                        <Card.Title>List of Credential Repositories for: {orgUnit.ouName}</Card.Title>

                                        {/* Map through the orUnit's divisions and return accordion with division names
                                        and table of credential repos for that division. */}
                                        {orgUnit.divisions.map((division, divisionIndex) => {
                                            return (
                                                <Accordion defaultActiveKey="0" key={divisionIndex}>
                                                    <Accordion.Item eventKey={divisionIndex}>
                                                        {/* Division name */}
                                                        <Accordion.Header>Division: {division.divisionName}</Accordion.Header>

                                                        {/* Credential Repos table belonging to this division. */}
                                                        <Accordion.Body>
                                                            <Table striped bordered hover className="ouTable align-middle" >
                                                                <thead >
                                                                    <tr className="text-center">
                                                                        <th>Repository Name</th>
                                                                        <th>Username</th>
                                                                        <th>Email</th>
                                                                        <th>Password</th>
                                                                        {/* If the user is admin or management, display 'Update Credentials' 
                                                                        field with table heading. */}
                                                                        {(ouData.role === 'admin' || ouData.role === 'management') &&
                                                                            <th>Update Credentials</th>
                                                                        }
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {/* Map through this division's credentialRepos and display table data. */}
                                                                    {division.credentialRepos.map((repo, repoIndex) => {
                                                                        return (
                                                                            <tr key={repoIndex}>
                                                                                <td>{repo.repoName}</td>
                                                                                <td>{repo.repoUsername}</td>
                                                                                <td>{repo.repoEmail}</td>
                                                                                <td>{repo.repoPassword}</td>
                                                                                {/* If the user is admin or management, display 
                                                                                'Update Credentials' field with update button that displays
                                                                                the EditRepoForm on click. */}
                                                                                {(ouData.role === 'admin' || ouData.role === 'management') &&
                                                                                    <td>
                                                                                        <Button
                                                                                            variant="success"
                                                                                            size="sm"
                                                                                            className="editRepoButton"
                                                                                            onClick={() => displayEditRepoForm(
                                                                                                repo.repoName,
                                                                                                division.divisionName,
                                                                                                orgUnit.ouName
                                                                                            )}
                                                                                        >
                                                                                            Update
                                                                                        </Button>
                                                                                    </td>
                                                                                }
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                    <tr>
                                                                        {/* Add Credential Repo button (displays AddRepoForm on click). */}
                                                                        <td colSpan={5}>
                                                                            <Button
                                                                                variant="primary"
                                                                                size="sm"
                                                                                className="addRepoButton"
                                                                                onClick={() => displayAddRepoForm(
                                                                                    division.divisionName,
                                                                                    orgUnit.ouName
                                                                                )}
                                                                            >
                                                                                Add new repo
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            )
                                        })}
                                    </Card.Body>
                                </Tab>

                                {/* --- OU Users Tab --- */}
                                {/* When the user is admin, display the OU Users tab.*/}
                                {ouData.role === 'admin' &&
                                    <Tab eventKey="ouUsersList" title="OU Users" className="ouUsersTab">
                                        <Card.Body key={unitIndex} className="ouUsersDetails">
                                            {/* OU Users title. */}
                                            <Card.Title className="pt-2 pb-4">List of Users assigned to: {orgUnit.ouName}</Card.Title>

                                            {/* OU Users Table */}
                                            <Table striped bordered hover className="ouTable align-middle" >
                                                <thead >
                                                    <tr className="text-center">
                                                        <th>Username</th>
                                                        <th>Unassign from this OU</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {/* Map through the OU's ouUsers list and return username and Unassign 
                                                    button for each user, which unassigns that user on click. */}
                                                    {orgUnit.ouUsers.map((userName, userIndex) => {
                                                        return (
                                                            <tr key={userIndex}>
                                                                <td>{userName}</td>
                                                                <td><Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    className="unassignUserButton"
                                                                    onClick={() => unassignFromOu(userName, orgUnit.ouName)}
                                                                >
                                                                    Unassign
                                                                </Button></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Tab>
                                }

                                {/* --- Division Users Tab --- */}
                                {/* When the user is admin, display the Division Users tab.*/}
                                {ouData.role === 'admin' &&
                                    <Tab eventKey="divisionUsersList" title="Division Users" className="divisionUsersTab">
                                        <Card.Body key={unitIndex} className="divisionUsersDetails">
                                            {/* Division Users title. */}
                                            <Card.Title>List of Division Users for: {orgUnit.ouName}</Card.Title>

                                            {/* Map through the OU's divisions and return accordion with table containing 
                                            the Division's name, the list of users assigned to that division and Unassign 
                                            buttons for each user. */}
                                            {orgUnit.divisions.map((division, divisionIndex) => {
                                                return (
                                                    <Accordion defaultActiveKey="0" key={divisionIndex}>
                                                        <Accordion.Item eventKey={divisionIndex}>
                                                            {/* Division name */}
                                                            <Accordion.Header>Division: {division.divisionName}</Accordion.Header>

                                                            {/* Division Users table for this division. */}
                                                            <Accordion.Body>
                                                                <Table striped bordered hover className="ouTable align-middle">
                                                                    {/* Division's name. */}
                                                                    <thead>
                                                                        <tr><th colSpan={3}>Division: {division.divisionName}</th></tr>
                                                                    </thead>

                                                                    {/* Table headings. */}
                                                                    <thead >
                                                                        <tr className="text-center">
                                                                            <th>Username</th>
                                                                            <th>Unassign from this Division</th>
                                                                        </tr>
                                                                    </thead>

                                                                    {/* Map through the divisionUsers and return username and Unassign 
                                                                    button for each user, which unassigns that user on click. */}
                                                                    <tbody>
                                                                        {division.divisionUsers.map((userName, userIndex) => {
                                                                            return (
                                                                                <tr key={userIndex}>
                                                                                    <td>{userName}</td>
                                                                                    <td><Button
                                                                                        variant="primary"
                                                                                        size="sm"
                                                                                        className="addCredentialRepoButton"
                                                                                        onClick={
                                                                                            () => unassignFromDivision(
                                                                                                userName,
                                                                                                orgUnit.ouName,
                                                                                                division.divisionName
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Unassign User
                                                                                    </Button></td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </Table>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                )
                                            })}
                                        </Card.Body>
                                    </Tab>
                                }
                            </Tabs>
                        </Card>
                    )
                } else {
                    // Else (i.e. if the user is not assigned to divisions in this OU), return card with OU name and message
                    // telling the user they do not have access to this OU's divisions/credential repos.
                    return (
                        <Card key={unitIndex} className="my-4">
                            <Tabs defaultActiveKey="overview" className="tabs">
                                {/* --- Overview Tab --- */}
                                <Tab eventKey="overview" title="Overview" className="overviewTab">
                                    <Card.Body className="overviewDetails">
                                        {/* OU name and message about divisions/crednetial repos access. */}
                                        <Card.Title>Organisational Unit: {orgUnit.ouName}</Card.Title>
                                        <p className="py-3 text-center">
                                            You are assigned to this OU but you are not assigned to any of its Divisions,
                                            so you do not have access to its Divisions or Credentials Repositories.
                                        </p>
                                    </Card.Body>
                                </Tab>
                            </Tabs>
                        </Card>
                    )
                }
            })}
        </>
    )
}




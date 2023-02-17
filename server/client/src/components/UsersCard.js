import React, { useState, useEffect } from 'react';

// Import Bootstrap components.
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';

export default function UsersCard({ ouData, setOuData, userData, allUsersData, setAllUsersData }) {
    // ---------- Set States ----------
    // For selected User data in forms.
    const [selectedUserName, setSelectedUserName] = useState();
    const [selectedRole, setSelectedRole] = useState();

    // For selected OU and Division data in forms.
    const [selectedOU, setSelectedOU] = useState();
    const [selectedDivision, setSelectedDivision] = useState();

    // For displaying error messages.
    const [error, setError] = useState();

    // For displaying success messages.
    const [success, setSuccess] = useState();

    // ---------- User Token ----------
    // Store token for CRUD requests' Authorization Headers.
    const userToken = userData.token;

    // ---------- Use Effect ----------
    // If the user is admin, gets all Users Data on first load.
    useEffect(() => {
        const getAllUsers = async () => {
            // Get and store the user's role.
            const userRole = ouData.role;

            // If the user is admin:
            if (userRole === 'admin') {
                // Store requset options for GET Users request.
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                // Send GET Users request to endpoint.
                const response = await fetch('/users', requestOptions);

                //  Store JSON data from response.
                const jsonData = await response.json();

                // If there is an error in the response, set error state to jsonData.
                if (!response.ok) {
                    setError(jsonData);
                }

                // If there is no error in the response, set error state to null and set allUsersData to the usersData.
                if (response.ok) {
                    setError(null);
                    setAllUsersData(jsonData.usersData);
                }
            }
        }
        getAllUsers();
    }, [ouData.role, setAllUsersData, userToken])

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

    // ---------- Handle Change Role ----------
    // Updates the selected user's role when the 'Change User Role' form is submitted.
    const handleChangeRole = async (e) => {
        // Prevent default page reload.
        e.preventDefault();

        // Create object to store selected user data.
        const selectedUserData = { selectedUserName, selectedRole };

        // Store request options for PUT User Roles request.
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedUserData)
        };

        // Send PUT User Roles request to endpoint.
        const response = await fetch(`/change-user-role`, requestOptions);

        // Store JSON data from response.
        const jsonData = await response.json();

        // If there is an error with the fetch request, set error state to jsonData.
        if (!response.ok) {
            setError(jsonData);
        }

        // If there is no error with the fetch request:
        if (response.ok) {
            // If the jsonData successKey is false:
            if (!jsonData.successKey) {
                // Reset states so form can be re-entered.
                setSelectedUserName('');
                setSelectedRole('');

                // Set success key to null.
                setSuccess(null);

                // Set error to jsonData's error message.
                setError(jsonData.message);

                // Set timeout for error message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setError(null)
                }, 3000);

            } else {
                // Else (i.e. if the successKey is true), reset states so form can be re-entered.
                setSelectedUserName('');
                setSelectedRole('');

                // Set error state to null.
                setError(null);

                // Store request options for GET Users request.
                const getUsersRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }

                // Fetch and set all users data again so that it is updated in the browser.
                const usersResponse = await fetch('/users', getUsersRequestOptions);
                const usersJsonData = await usersResponse.json();
                setAllUsersData(usersJsonData.usersData);

                // Store request options for GET OU Data request.
                const getOUsRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                // Fetch and set all OU data again so that it is updated in the browser.
                const ouResponse = await fetch('/organisational-units', getOUsRequestOptions);
                const ouJsonData = await ouResponse.json();
                setOuData(ouJsonData);

                // Set success state to jsonData's success message.
                setSuccess(jsonData.message);

                // Set timeout for success message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setSuccess(null)
                }, 3000);
            }
        }
    }

    // ---------- Handle Assign User to OU and Division ----------
    // Assigns the selected user to an OU and/or Division when the 'Assign Users to OUs and Divisions'
    // form is submitted.
    const handleAssignOU = async (e) => {
        // Prevent default page reload.
        e.preventDefault();

        // Create object to store selected OU data.
        const assignOuData = { selectedUserName, selectedOU, selectedDivision };

        // Store request options for PUT Assign User request.
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(assignOuData)
        };

        // PUT Assign User request to endpoint.
        const response = await fetch(`/assign-user`, requestOptions);

        // Store JSON data from response.
        const jsonData = await response.json();

        // If there is an error with the fetch request, set error state to jsonData.
        if (!response.ok) {
            setError(jsonData);
        }

        // If there is no error with the fetch request:
        if (response.ok) {
            // If the jsonData successKey is false:
            if (!jsonData.successKey) {
                // Reset states so form can be re-entered.
                setSelectedUserName('');
                setSelectedOU('');
                setSelectedDivision('');

                // Set success key to null.
                setSuccess(null);

                // Set error to jsonData's error message.
                setError(jsonData.message);

                // Set timeout for error message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setError(null)
                }, 3000);

            } else {
                // Else (i.e. if the successKey is true), reset states so form can be re-entered.
                setSelectedUserName('');
                setSelectedOU('');
                setSelectedDivision('');

                // Set error state to null.
                setError(null);

                // Store requset options for GET Users request.
                const getUsersRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }

                // Fetch and set all usersData again so that it is updated in the browser.
                const usersResponse = await fetch('/users', getUsersRequestOptions);
                const usersJsonData = await usersResponse.json();
                setAllUsersData(usersJsonData.usersData);

                // Store requset options for GET ouData request.
                const getOUsRequestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: userToken
                    }
                }
                // Fetch and set all ouData again so that it is updated in the browser.
                const ouResponse = await fetch('/organisational-units', getOUsRequestOptions);
                const ouJsonData = await ouResponse.json();
                setOuData(ouJsonData);

                // Set success state to jsonData's success message.
                setSuccess(jsonData.message);

                // Set timeout for error message to stop displaying after 3 seconds.
                setTimeout(() => {
                    setSuccess(null)
                }, 3000);
            }
        }
    }

    // If allUsersData contains data and the user is admin, return the card populated with users data and forms to update data.
    if (allUsersData && ouData.role === 'admin') {
        return (
            <Card className="my-4 ms-3 me-4">
                <Tabs defaultActiveKey="usersList" className="tabs">
                    {/* ---------- Users List Tab ---------- */}
                    <Tab eventKey="usersList" title="Users List" >
                        <Card.Body className="usersDetails">
                            {/* Card headers */}
                            <Card.Title>All Users</Card.Title>
                            <Card.Subtitle className="py-3 text-center">
                                Users are listed by role. Select role dropdown to view users.
                            </Card.Subtitle>

                            {/* Accordion for listing users by role. */}
                            <Accordion key="0">

                                {/* --- (1) List Admin Users --- */}
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Admin Users</Accordion.Header>
                                    {/* Admin Users table. */}
                                    <Accordion.Body>
                                        <Table striped bordered hover className="usersTable" >
                                            <thead>
                                                <tr className="text-center">
                                                    <th>Username</th>
                                                    <th>Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allUsersData.adminUsers.map((user, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{user.username}</td>
                                                            <td>{user.role}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/* --- (2) List Management Users --- */}
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Management Users</Accordion.Header>
                                    {/* Management Users table. */}
                                    <Accordion.Body>
                                        <Table striped bordered hover className="usersTable" >
                                            <thead >
                                                <tr className="text-center">
                                                    <th>Username</th>
                                                    <th>Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allUsersData.managementUsers.map((user, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{user.username}</td>
                                                            <td>{user.role}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/* --- (2) List Normal Users --- */}
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>Normal Users</Accordion.Header>
                                    {/* Normal Users table. */}
                                    <Accordion.Body>
                                        <Table striped bordered hover className="usersTable align-middle" >
                                            <thead >
                                                <tr className="text-center">
                                                    <th>Username</th>
                                                    <th>Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allUsersData.normalUsers.map((user, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{user.username}</td>
                                                            <td>{user.role}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Card.Body>
                    </Tab>

                    {/* ---------- Manage Users Tab ---------- */}
                    <Tab eventKey="manageUsers" title="Manage Users" className="manageUsersTab">
                        <Card.Body className="usersDetails">
                            <Card.Title>Manage Users</Card.Title>

                            {/* Accordion for (1) Updating User Roles and (2) Assigning users to OUs and Divisions. */}
                            <Accordion key="0">
                                {/* --- (1) Update User Roles --- */}
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Change User Role</Accordion.Header>
                                    <Accordion.Body>
                                        {/* Instructions to user. */}
                                        <p className="py-3 text-center manageUserFormInstructions">
                                            Select the user whose role you want to change, then select the role you want to
                                            assign to them.
                                        </p>

                                        {/* Update Roles Form. */}
                                        <Form onSubmit={handleChangeRole} className="changeRoleForm mx-auto" >
                                            {/* Form Group 1: Select User */}
                                            <Form.Group as={Row} className="mb-3" controlId="formUser">
                                                <Form.Label column sm={5}>Username:</Form.Label>
                                                <Col sm={7}>
                                                    <Form.Select
                                                        value={selectedUserName}
                                                        onChange={e => setSelectedUserName(e.target.value)}
                                                    >
                                                        <option>Select user...</option>
                                                        {/* Map through normalUsers to display them in the dropdown. */}
                                                        {allUsersData.normalUsers.map((normalUser, normalUserIndex) => {
                                                            return (
                                                                <option value={normalUser.username} key={normalUserIndex}>
                                                                    {normalUser.username} - {normalUser.role} user
                                                                </option>
                                                            )

                                                        })}

                                                        {/* Map through managementUsers to display them in the dropdown. */}
                                                        {allUsersData.managementUsers.map((managementUser, managementUserIndex) => {
                                                            return (
                                                                <option value={managementUser.username} key={managementUserIndex}>
                                                                    {managementUser.username} - {managementUser.role} user
                                                                </option>
                                                            )
                                                        })}

                                                        {/* Map through adminUsers to display them in the dropdown. */}
                                                        {allUsersData.adminUsers.map((adminUser, adminUserIndex) => {
                                                            return (
                                                                <option value={adminUser.username} key={adminUserIndex}>
                                                                    {adminUser.username} - {adminUser.role} user
                                                                </option>
                                                            )
                                                        })}
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            {/* Form Group 2: Select New Role. */}
                                            <Form.Group as={Row} className="mb-3" controlId="formUser">
                                                <Form.Label column sm={5}>Change Role:</Form.Label>
                                                <Col sm={7}>
                                                    <Form.Select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                                                        <option>Select new role...</option>
                                                        <option value="normal" >Normal</option>
                                                        <option value="management" >Management</option>
                                                        <option value="admin">Admin</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            {/* Form Group 3: Submit button */}
                                            <Form.Group as={Row} >
                                                <Col sm={{ span: 12 }}>
                                                    <Button type="submit" className="my-4">Update user role</Button>
                                                </Col>
                                            </Form.Group>
                                        </Form>

                                        {/* When error state is true, display error message. */}
                                        {error &&
                                            <Container className="error border border-danger border-2">
                                                <Row>
                                                    <Col className="text-end">
                                                        <p className="closeMessageButton" onClick={handleHideError}>close</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p> {error}</p>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        }

                                        {/* When success state is true, display success message. */}
                                        {success &&
                                            <Container className="success border border-success border-2">
                                                <Row>
                                                    <Col className="text-end">
                                                        <p className="closeMessageButton" onClick={handleHideSuccess}>close</p>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <p> {success}</p>
                                                    </Col>
                                                </Row>
                                            </Container>
                                        }
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/* --- (2) Assign Users to OUs and Divisions --- */}
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Assign Users to OUs and Divisions</Accordion.Header>
                                    <Accordion.Body>
                                        {/* Instructions to user. */}
                                        <p className="py-3 text-center manageUserFormInstructions">
                                            Select the user you wish to assign, then select the OU name and Division you want them assigned to.
                                            If you do not want to assign this user to a division, select 'none' in the Division dropdown.
                                        </p>
                                        {/* Assign Users to OUs and Divisions Form. */}
                                        <Form onSubmit={handleAssignOU} className="changeRoleForm mx-auto" >
                                            {/* Form Group 1: Select User */}
                                            <Form.Group as={Row} className="mb-3" controlId="formUser">
                                                <Form.Label column sm={5}>Username:</Form.Label>
                                                <Col sm={7}>
                                                    <Form.Select
                                                        value={selectedUserName}
                                                        onChange={e => setSelectedUserName(e.target.value)}
                                                    >
                                                        <option>Select user...</option>
                                                        {/* Map through normalUsers to display them in the dropdown. */}
                                                        {allUsersData.normalUsers.map((normalUser, normalUserIndex) => {
                                                            return (
                                                                <option value={normalUser.username} key={normalUserIndex}>
                                                                    {normalUser.username} - {normalUser.role} user
                                                                </option>
                                                            )
                                                        })}

                                                        {/* Map through managementUsers to display them in the dropdown. */}
                                                        {allUsersData.managementUsers.map((managementUser, managementUserIndex) => {
                                                            return (
                                                                <option value={managementUser.username} key={managementUserIndex}>
                                                                    {managementUser.username} - {managementUser.role} user
                                                                </option>
                                                            )
                                                        })}

                                                        {/* Map through adminUsers to display them in the dropdown. */}
                                                        {allUsersData.adminUsers.map((adminUser, adminUserIndex) => {
                                                            return (
                                                                <option value={adminUser.username} key={adminUserIndex}>
                                                                    {adminUser.username} - {adminUser.role} user
                                                                </option>
                                                            )
                                                        })}
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            {/* Form Group 2: Select New OU */}
                                            <Form.Group as={Row} className="mb-3" controlId="formOU">
                                                <Form.Label column sm={5}>Assign to OU:</Form.Label>
                                                <Col sm={7}>
                                                    <Form.Select
                                                        value={selectedOU}
                                                        onChange={e => setSelectedOU(e.target.value)}
                                                    >
                                                        <option>Select OU...</option>
                                                        {/* Map through ouData's orgUnits to display them in the dropdown. */}
                                                        {ouData.orgUnits.map((orgUnit, unitIndex) => {
                                                            return (
                                                                <option value={orgUnit.ouName} key={unitIndex}>
                                                                    {orgUnit.ouName}
                                                                </option>
                                                            )
                                                        })}
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>

                                            {/* Form Group 3: Select New Division */}
                                            {/* When  selectedOU is true (i.e. the OU has been selected, display the 
                                                divisions dropdown populated with the selected OU's divisions. */}
                                            {selectedOU &&
                                                <Form.Group as={Row} className="mb-3" controlId="formDivision">
                                                    <Form.Label column sm={5}>Assign to Division:</Form.Label>
                                                    <Col sm={7}>
                                                        <Form.Select
                                                            value={selectedDivision}
                                                            onChange={e => setSelectedDivision(e.target.value)}
                                                        >
                                                            <option>Select Division...</option>
                                                            <option value="none">none</option>
                                                            {/* Map through all OU's and their divisions to get their division names 
                                                                and display them in the dropdown. */}
                                                            {ouData.orgUnits.map((orgUnit, ouIndex) => {
                                                                // If the OU name matches the selectedOU, return its divisions in the dropdown list.
                                                                if (orgUnit.ouName === selectedOU) {
                                                                    return (
                                                                        orgUnit.divisions.map((division, divisionIndex) => {
                                                                            return (
                                                                                <option
                                                                                    value={division.divisionName}
                                                                                    key={divisionIndex}
                                                                                >
                                                                                    {division.divisionName} (OU: {orgUnit.ouName})
                                                                                </option>
                                                                            )
                                                                        })
                                                                    )
                                                                } else {
                                                                    // Else, return a disabled option with the unselected OU name.
                                                                    // NOTE: This accounts for the warning: 'Array.prototype.map() 
                                                                    // expects a value to be returned at the end of arrow function'.
                                                                    return (
                                                                        <option key={ouIndex} disabled>(OU: {orgUnit.ouName})</option>
                                                                    )
                                                                }
                                                            })}
                                                        </Form.Select>
                                                    </Col>
                                                </Form.Group>
                                            }

                                            {/* Form Group 4: Submit button. */}
                                            <Form.Group as={Row} >
                                                <Col sm={{ span: 12 }}>
                                                    <Button type="submit" className="my-4">Assign User</Button>
                                                </Col>
                                            </Form.Group>
                                        </Form>

                                        {/* When error state is true, display error message under form. */}
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

                                        {/* When success state is true, display success message under form. */}
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
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Card.Body>
                    </Tab>
                </Tabs>
            </Card>
        )
    }
}
